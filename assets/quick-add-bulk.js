class BulkModal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (this.innerHTML.trim() === '') {
      const productUrl = this.dataset.url.split('?')[0];
      fetch(`${productUrl}?section_id=bulk-quick-order-list`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const sourceQty = html.querySelector('.quick-order-list-container').parentNode;
          this.innerHTML = sourceQty.innerHTML;
          document.body.classList.add('quickshop-popup-show');
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }
}

customElements.define('bulk-modal', BulkModal);

if (!customElements.get('quick-add-bulk')) {
  customElements.define(
    'quick-add-bulk',
    class QuickAddBulk extends BulkAdd {
      constructor() {
        super();
        this.quantity = this.querySelector('quantity-input-bulk');

        const debouncedOnChange = debounce((event) => {
          if (parseInt(event.target.value) === 0) {
            this.startQueue(event.target.dataset.index, parseInt(event.target.value));
          } else {
            this.validateQuantity(event);
          }
        }, ON_CHANGE_DEBOUNCE_TIMER);

        this.addEventListener('change', debouncedOnChange.bind(this));
        this.listenForActiveInput();
        this.listenForKeydown();
        this.lastActiveInputId = null;
        const pageParams = new URLSearchParams(window.location.search);
        window.pageNumber = decodeURIComponent(pageParams.get('page') || '');
      }

      connectedCallback() {
        this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
          if (
            event.source === 'quick-add' 
            // || (event.cartData.items && !event.cartData.items.some((item) => item.id === parseInt(this.dataset.index))) ||
            // (event.cartData.variant_id && !(event.cartData.variant_id === parseInt(this.dataset.index)))
          ) {
            return;
          }
          // If its another section that made the update
          this.onCartUpdate().then(() => {
            this.listenForActiveInput();
            this.listenForKeydown();
          });
        });
      }

      disconnectedCallback() {
        if (this.cartUpdateUnsubscriber) {
          this.cartUpdateUnsubscriber();
        }
      }

      getInput() {
        return this.querySelector('quantity-input-bulk input');
      }

      listenForActiveInput() {
        if (!this.classList.contains('hidden')) {
          this.getInput().addEventListener('focusin', (event) => event.target.select());
        }
        this.isEnterPressed = false;
      }

      listenForKeydown() {
        this.getInput().addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            this.getInput().blur();
            this.isEnterPressed = true;
          }
        });
      }

      cleanErrorMessageOnType(event) {
        event.target.addEventListener(
          'keypress',
          () => {
            event.target.setCustomValidity('');
          },
          { once: true }
        );
      }

      onCartUpdate() {
        return new Promise((resolve, reject) => {
          fetch(`${this.getSectionsUrl()}?section_id=${this.closest('.collection').dataset.id}`)
            .then((response) => response.text())
            .then((responseText) => {
              const html = new DOMParser().parseFromString(responseText, 'text/html');
              const sourceQty = html.querySelector(
                `#quick-add-bulk-${this.dataset.index}-${this.closest('.collection').dataset.id}`
              );
              if (sourceQty) {
                this.innerHTML = sourceQty.innerHTML;
              }
              resolve();
            })
            .catch((e) => {
              console.error(e);
              reject(e);
            });
        });
      }

      updateMultipleQty(items) {
        const ids = Object.keys(items);
        const body = JSON.stringify({
          updates: items,
          sections: this.getSectionsToRender().map((section) => section.section),
          sections_url: this.getSectionsUrl(),
        });

        fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } })
          .then((response) => {
            return response.text();
          })
          .then((state) => {
            const parsedState = JSON.parse(state);
            this.renderSections(parsedState, ids);
            publish(PUB_SUB_EVENTS.cartUpdate, { source: 'quick-add', cartData: parsedState });
          })
          .catch(() => {
            // Commented out for now and will be fixed when BE issue is done https://github.com/Shopify/shopify/issues/440605
            // e.target.setCustomValidity(error);
            // e.target.reportValidity();
            // this.resetQuantityInput(ids[index]);
            // e.target.select();
            // this.cleanErrorMessageOnType(e);
          })
          .finally(() => {
            this.requestStarted = false;
          });
      }

      getSectionsToRender() {
        return [
          {
            id: `quick-add-bulk-${this.dataset.index}-${this.closest('.collection-quick-add-bulk').dataset.id}`,
            section: this.closest('.collection-quick-add-bulk').dataset.id,
            selector: `#quick-add-bulk-${this.dataset.index}-${this.closest('.collection-quick-add-bulk').dataset.id}`,
          },
          {
            id: 'cart-icon-bubble',
            section: 'cart-icon-bubble',
            selector: '.shopify-section',
          },
          {
            id: 'CartDrawer',
            selector: '#CartDrawer',
            section: 'cart-drawer',
          },
        ];
      }

      renderSections(parsedState, ids) {
        const intersection = this.queue.filter((element) => ids.includes(element.id));
        if (intersection.length !== 0) return;
        this.getSectionsToRender().forEach((section) => {
          const sectionElement = document.getElementById(section.id);
          if (
            sectionElement &&
            sectionElement.parentElement &&
            sectionElement.parentElement.classList.contains('drawer')
          ) {
            parsedState.items.length > 0
              ? sectionElement.parentElement.classList.remove('is-empty')
              : sectionElement.parentElement.classList.add('is-empty');

            setTimeout(() => {
              document.querySelector('#CartDrawer-Overlay').addEventListener('click', this.cart.close.bind(this.cart));
            });
          }
          const elementToReplace =
            sectionElement && sectionElement.querySelector(section.selector)
              ? sectionElement.querySelector(section.selector)
              : sectionElement;
          if (elementToReplace) {
            elementToReplace.innerHTML = this.getSectionInnerHTML(
              parsedState.sections[section.section],
              section.selector
            );
          }
        });

        if (this.isEnterPressed) {
          this.querySelector(`#Quantity-${this.lastActiveInputId}`).select();
        }

        this.listenForActiveInput();
        this.listenForKeydown();
      }
    }
  );
}
