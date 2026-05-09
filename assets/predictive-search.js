class PredictiveSearch extends SearchForm {
  constructor() {
    super();
    this.cachedResults = {};
    this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
    this.trendingAndProductsBlock = this.querySelector('[data-quick-trending-products]');
    this.closeStickySearchButton = document.querySelector('.header-search-close');
    this.productToShow = this.dataset.productToShow;
    this.searchDetails = this.querySelector('.search_details');
    this.predictiveSearch = this.querySelector('predictive-search')
    this.allPredictiveSearchInstances = document.querySelectorAll('predictive-search');
    this.isOpen = false;
    this.abortController = new AbortController();
    this.searchTerm = '';
    this.quickSearchTrending = this.querySelectorAll('.quickSearchTrending .link');
    this.searchResultsWidget = this.getElementsByClassName('quickSearchResultsWidget')[0];

    this.setupEventListeners();
    this.quickSearchTrending.forEach(element => {
      element.addEventListener('click', this.quickSearchTrendingClick.bind(this));
    });
  }
  
  setupEventListeners() {
    this.input.form.addEventListener('submit', this.onFormSubmit.bind(this));

    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.addEventListener('keyup', this.onKeyup.bind(this));
    this.addEventListener('keydown', this.onKeydown.bind(this));

    document.addEventListener('click', this.onDocClick.bind(this));
    if (this.closeStickySearchButton != null) {
      this.closeStickySearchButton.addEventListener('click', this.onCloseStickySearchClick.bind(this));
    }
  }

  handleResponse(data,limit) {
    let htmlMedia = document.createElement('div');
    htmlMedia.innerHTML = data;

    $(htmlMedia).find(`.product:nth-child(n+${Number(limit) + 1})`).remove();
    return $(htmlMedia).html();
  }

  getQuery() {
    return this.input.value.trim();
  }

  onChange() {
    const newSearchTerm = this.getQuery();
    if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
      // Remove the results when they are no longer relevant for the new search term
      // so they don't show up when the dropdown opens again
      this.querySelector('#predictive-search-results-groups-wrapper')?.remove();
    }

    this.searchTerm = newSearchTerm;

    if (!this.searchTerm.length) {
      this.close(true);
      return;
    }

    this.getSearchResults(this.searchTerm);
  }

  onFormSubmit(event) {
    if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) event.preventDefault();
  }

  onFormReset(event) {
    super.onFormReset(event);
    if (super.shouldResetForm()) {
      this.searchTerm = '';
      this.abortController.abort();
      this.abortController = new AbortController();
      this.closeResults(true);
    }
  }

  onFocus() {
    const currentSearchTerm = this.getQuery();

    if (!currentSearchTerm.length) return this.showTrendingAndProducts();

    if (this.searchTerm !== currentSearchTerm) {
      // Search term was changed from other search input, treat it as a user change
      this.onChange();
    } else if (this.getAttribute('results') === 'true') {
      this.open();
    } else {
      this.getSearchResults(this.searchTerm);
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }
  
  onKeyup(event) {
    if (!this.getQuery().length) {
      this.close(true);
      this.showTrendingAndProducts();
    };
    event.preventDefault();
    
    switch (event.code) {
      case 'ArrowUp':
        this.switchOption('up');
        break;
      case 'ArrowDown':
        this.switchOption('down');
        break;
      case 'Enter':
        this.selectOption();
        break;
    }
  }

  onKeydown(event) {
    // Prevent the cursor from moving in the input when using the up and down arrow keys
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      event.preventDefault();
    }
  }

  switchOption(direction) {
    if (!this.getAttribute('open')) return;

    const moveUp = direction === 'up';
    const selectedElement = this.querySelector('[aria-selected="true"]');
  
    // Filter out hidden elements (duplicated page and article resources) thanks
    // to this https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    const allVisibleElements = Array.from(this.querySelectorAll('li, button.predictive-search__item')).filter(
      (element) => element.offsetParent !== null
    );
    let activeElementIndex = 0;

    if (moveUp && !selectedElement) return;

    let selectedElementIndex = -1;
    let i = 0;

    while (selectedElementIndex === -1 && i <= allVisibleElements.length) {
      if (allVisibleElements[i] === selectedElement) {
        selectedElementIndex = i;
      }
      i++;
    }

    this.statusElement.textContent = '';
    
    if (!moveUp && selectedElement) {
      activeElementIndex = selectedElementIndex === allVisibleElements.length - 1 ? 0 : selectedElementIndex + 1;
    } else if (moveUp) {
      activeElementIndex = selectedElementIndex === 0 ? allVisibleElements.length - 1 : selectedElementIndex - 1;
    }

    if (activeElementIndex === selectedElementIndex) return;

    const activeElement = allVisibleElements[activeElementIndex];

    activeElement.setAttribute('aria-selected', true);
    if (selectedElement) selectedElement.setAttribute('aria-selected', false);

    this.input.setAttribute('aria-activedescendant', activeElement.id);
  }
    
  selectOption() {
    const selectedOption = this.querySelector('[aria-selected="true"] a, button[aria-selected="true"]');

    if (selectedOption) selectedOption.click();
  }
  
  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(' ', '-').toLowerCase();
    this.setLiveRegionLoadingState();
    
    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      this.updateViewAllLink(searchTerm);
      return;
    }

    fetch(`${routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&section_id=predictive-search&resources[type]=query,product,collection,page,article`, {
      signal: this.abortController.signal,
    })
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }
        
        return response.text();
      })  
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector('#shopify-section-predictive-search').innerHTML;
        // Save bandwidth keeping the cache in all instances synced
        this.allPredictiveSearchInstances.forEach((predictiveSearchInstance) => {
          predictiveSearchInstance.cachedResults[queryKey] = resultsMarkup;
        });
        this.cachedResults[queryKey] = resultsMarkup;
        this.renderSearchResults(resultsMarkup);
        this.updateViewAllLink(searchTerm);
      })
      .catch((error) => {
        if (error?.code === 20) {
          // Code 20 means the call was aborted
          return;
        }
        this.close();
        throw error;
      });
  }
  
  setLiveRegionLoadingState() {
    this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
    this.loadingText = this.loadingText || this.getAttribute('data-loading-text');
    
    this.setLiveRegionText(this.loadingText);
    this.setAttribute('loading', true);
  }

  setLiveRegionText(statusText) {
    this.statusElement.setAttribute('aria-hidden', 'false');
    this.statusElement.textContent = statusText;
    
    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', 'true');
    }, 1000);
  }

  renderSearchResults(resultsMarkup) {
    this.predictiveSearchResults.innerHTML = resultsMarkup;
    this.setAttribute('results', true);
    this.setAttribute('open', true);
    this.setLiveRegionResults();
    this.open();
    this.hideTrendingAndProducts();
    if($('.dropdown-item[data-currency]').length){
      if ((window.show_multiple_currencies && typeof Currency != 'undefined' && Currency.currentCurrency != shopCurrency) || window.show_auto_currency) {
        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
      }
    }
    window.sharedFunctions?.swapHoverVideoProductCard();
    if($('body').hasClass('product-card-layout-08')) {
      window.sharedFunctions?.productCountdownCard();
    }
  }

  setLiveRegionResults() {
    this.removeAttribute('loading');
    this.setLiveRegionText(this.querySelector('[data-predictive-search-live-region-count-value]').textContent);
  }
  
  getResultsMaxHeight() {
    this.resultsMaxHeight = window.innerHeight - document.querySelector('[class^="header-navigation"]').getBoundingClientRect().bottom;
    return this.resultsMaxHeight;
  }
  
  open() {
    this.predictiveSearchResults.style.maxHeight = this.resultsMaxHeight || `${this.getResultsMaxHeight()}px`;
    this.setAttribute('open', true);
    this.input.setAttribute('aria-expanded', true);
    this.isOpen = true;
  }

  close(clearSearchTerm = false) {
    this.closeResults(clearSearchTerm);
    this.isOpen = false;
  }

  closeResults(clearSearchTerm = false) {
    if (clearSearchTerm) {
      this.input.value = '';
      this.removeAttribute('results');
    }
    const selected = this.querySelector('[aria-selected="true"]');

    if (selected) selected.setAttribute('aria-selected', false);

    this.input.setAttribute('aria-activedescendant', '');
    this.removeAttribute('loading');
    this.removeAttribute('open');
    this.input.setAttribute('aria-expanded', false);
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.removeAttribute('style');
  }

  showTrendingAndProducts() {
    if (!this.trendingAndProductsBlock) return 
    this.trendingAndProductsBlock.classList.add('is-show')
    this.trendingAndProductsBlock.classList.remove('hidden');
  }

  hideTrendingAndProducts() {
    if (!this.trendingAndProductsBlock) return 

    this.trendingAndProductsBlock.classList.remove('is-show')
    this.trendingAndProductsBlock.classList.add('hidden');
  }

  onDocClick(e) {
    const isInModal = this.contains(e.target), $target = e.target

    if (!isInModal || $target.closest('.header-search-popup-close') || $target.matches('.header-search-popup-close') || $target.closest('.header-search-close') || $target.matches('.header-search-close')) {
      this.close();
      this.hideTrendingAndProducts();
    }
  }

  onCloseStickySearchClick() {
    this.close();
    this.hideTrendingAndProducts();
    document.querySelector('body').classList.remove('sticky-search-open');
    document.querySelector('body').classList.remove('sticky-search-menu-open');
    this.closest('[class*="section-header-"]')?.classList.remove('sticky-search-menu-open')
    this.closest('[class*="section-header-"]')?.classList.remove('sticky-search-menu-custom-open')
  }

  updateViewAllLink(searchTerm) {
    const qsViewAllLink = document.querySelector('[data-qs-view-all-link]');
    if (!qsViewAllLink) return 
    // const linkTotal = `${routes.search_url}?q=${encodeURIComponent(searchTerm)}&${encodeURIComponent('resources[type]')}=product`
    const linkTotal = `${routes.search_url}?q=${encodeURIComponent(searchTerm)}&options%5Bprefix%5D=last&type=product`;
    
    qsViewAllLink.href = linkTotal
    return this.getTotalResults(linkTotal).then(count => {
      qsViewAllLink.innerHTML = qsViewAllLink.innerHTML.replace('()', `(${count})`)
    });
  }

  getTotalResults(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })  
      .then((text) => {
        const totalCount = new DOMParser().parseFromString(text, 'text/html').querySelector('[id^="SearchSection"]').dataset.searchCount;
        return totalCount
      })
      .catch((error) => {
        this.close();
        throw error;
      });
  }

  quickSearchTrendingClick(event) {
    window.location = event.currentTarget.getAttribute('href');
  }
}

customElements.define('predictive-search', PredictiveSearch);
