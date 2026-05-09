class VariantEditCartSelects extends HTMLElement {
    constructor() {
        super();
        this.variantSelect = this;
        this.item = $(this.variantSelect).closest('.product-edit-item');

        if (this.variantSelect.classList.contains('has-default')) {
            this.updateOptions();
            this.updateMasterId();
            this.renderProductInfo();
        }

        if (!this.currentVariant) {
            this.item[0].dataset.inStock = 'false'
        } else {
            if (this.item[0]) {
                this.item[0].dataset.inStock = this.currentVariant.available ? 'true' : 'false'
            }
        }

        var inventory = this.currentVariant?.inventory_management;

        if (inventory != null) {
            var productId = this.item.data('cart-edit-id'),
                arrayInVarName = 'edit_cart_inven_array_' + productId,
                inven_array = window[arrayInVarName];

            if (inven_array != undefined) {
                var inven_num = inven_array[this.currentVariant.id],
                    inventoryQuantity = parseInt(inven_num);

                this.item.find('input[name="quantity"]').attr('data-inventory-quantity', inventoryQuantity);
            }
        }

        this.onVariantInit();
        this.addEventListener('change', this.onVariantChange.bind(this));
    }

    onVariantInit() {
        this.updateVariantStatuses();
    }

    onVariantChange(event) {
        this.updateOptions();
        this.updateMasterId();
        this.updateVariantStatuses();

        if (!this.currentVariant) {
            this.updateAttribute(true);
        } else {
            this.updateMedia();
            this.updateVariantInput();
            this.updatePrice();
            this.renderProductInfo();
            this.updateAttribute(false, !this.currentVariant.available);
        }

        this.updateAddToCartButton();
        
        if($('.dropdown-item[data-currency]').length){
            if ((window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }
        }
    }

    updateOptions() {
        this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
    }

    updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
            return !variant.options.map((option, index) => {
                return this.options[index] === option;
            }).includes(false);
        });
    }

    updateMedia() {
        if (!this.currentVariant || !this.currentVariant?.featured_image) return;
        const itemImage = this.item.find('.product-edit-image');
        const image = this.currentVariant?.featured_image;

        if (!itemImage) return;

        itemImage.find('img').attr({
            'src': image.src,
            'srcset': image.src,
            'alt': image.alt
        });
    }

    updateVariantInput() {
        const productForm = this.closest('.product-edit-itemRight').querySelector('form') || document.querySelector(`#product-form-edit-${this.dataset.product}`);

        if (!productForm) return;

        const input = productForm.querySelector('input[name="id"]');

        if (!input) return;

        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    updatePrice() {
        const itemPrice = this.item.find('.product-edit-price');

        if (!itemPrice) return;

        var price = this.currentVariant?.price,
            compare_at_price = this.currentVariant?.compare_at_price;

        itemPrice.find('.price').html(Shopify.formatMoney(price, window.money_format)).show();

        if (compare_at_price > price) {
            itemPrice.find('.compare-price').html(Shopify.formatMoney(compare_at_price, window.money_format)).show();
            itemPrice.find('.price').addClass('new-price');
        } else {
            itemPrice.find('.compare-price').hide();
            itemPrice.find('.price').removeClass('new-price');
        }
    }

    renderProductInfo() {
        var inventory = this.currentVariant?.inventory_management;

        if (inventory != null) {
            var productId = this.item.data('cart-edit-id'),
                arrayInVarName = 'edit_cart_inven_array_' + productId,
                inven_array = window[arrayInVarName];

            if (inven_array != undefined) {
                var inven_num = inven_array[this.currentVariant.id],
                    inventoryQuantity = parseInt(inven_num);

                this.item.find('input[name="quantity"]').attr('data-inventory-quantity', inventoryQuantity);

                if (this.item.find('.product-edit-hotStock').length > 0) {
                    var hotStock = this.item.find('.product-edit-hotStock'),
                        maxStock = hotStock.data('edit-cart-hot-stock');

                    if (inventoryQuantity > 0 && inventoryQuantity <= maxStock) {
                        var textStock = window.inventory_text.hotStock.replace('[inventory]', inventoryQuantity);
                        hotStock.text(textStock).show();
                    } else {
                        hotStock.hide();
                    }
                }
            }
        }
    }

    updateVariantStatuses() {
        // const options = this.item.find('.productView-details .product-form__input'),
        //     optionsLength = options.length,
        //     pvOptionsLength = PVoptions.length,
        //     checkStickyVariant = false;

        // optionsLength > pvOptionsLength ? checkStickyVariant = true : '';

        const selectedOptionOneVariants = this.variantData.filter(variant => this.querySelector(':checked').value === variant.option1);
        const inputWrappers = [...this.querySelectorAll('.product-form__input')];
        const inputLength = inputWrappers.length;
        const variant_swatch = [...this.querySelectorAll('.product-form__swatch')];
        inputWrappers.forEach((option, index) => {
            option.querySelector('[data-header-option]').innerText = option.querySelector(':checked').value;
            if (index === 0 && inputLength > 1) return;
            const optionInputs = [...option.querySelectorAll('input[type="radio"], option')]
            const previousOptionSelected = inputLength > 1 ? inputWrappers[index - 1].querySelector(':checked').value : inputWrappers[index].querySelector(':checked').value;
            const optionInputsValue = inputLength > 1 ? selectedOptionOneVariants.filter(variant => variant[`option${index}`] === previousOptionSelected).map(variantOption => variantOption[`option${index + 1}`]) : this.variantData.map(variantOption => variantOption[`option${index + 1}`]);
            const availableOptionInputsValue = inputLength > 1 ? selectedOptionOneVariants.filter(variant => variant.available && variant[`option${index}`] === previousOptionSelected).map(variantOption => variantOption[`option${index + 1}`]) : this.variantData.filter(variant => variant.available).map(variantOption => variantOption[`option${index + 1}`]);
            this.setInputAvailability(optionInputs, optionInputsValue, availableOptionInputsValue)
            if (variant_swatch.length > 1) {
                this.updateImageSwatch(selectedOptionOneVariants)
            }
        });
    }

    updateImageSwatch(selectedOptionOneVariants) {
        const inputWrappers = this.querySelectorAll('.product-form__input');
        if (inputWrappers) {
            inputWrappers.forEach((element, inputIndex) => {
                const imageSpan = element.querySelectorAll("label>span.pattern");
                const imageLabel = element.querySelectorAll("label");
                const imageSpanImage = element.querySelectorAll("label>span.expand>img");
                const inputList = element.querySelectorAll("input");

                inputList.forEach((item, index) => {
                    const image = selectedOptionOneVariants.filter(tmp => {
                        if (inputIndex == 0) return tmp.option1 == item.value;
                        if (inputIndex == 1) return tmp.option2 == item.value;
                        if (inputIndex == 2) return tmp.option3 == item.value;
                    });

                    if (image.length > 0) {
                        imageLabel[index].style.display = "inline-block";
                        if (imageSpan[index] != undefined && image[0].featured_image != null) imageSpan[index].style.backgroundImage = `url("${image[0].featured_image.src}")`;
                        if (imageSpanImage[index] != undefined && image[0].featured_image != null) imageSpanImage[index].srcset = image[0].featured_image.src;
                    }
                })
            });
        }
    }

    updateAttribute(unavailable = true, disable = true) {
        var alertBox = this.item.find('.alertBox'),
            quantityInput = this.item.find('input[name="quantity"]'),
            notifyMe = this.item.find('.product-edit-notifyMe'),
            hotStock = this.item.find('.productView-hotStock');

        if (unavailable) {
            this.item.removeClass('isChecked');
            quantityInput.attr('disabled', true);
            alertBox.find('.alertBox-message').text(window.variantStrings.unavailable_message);
            alertBox.show();
            notifyMe.slideUp('slow');

            if (hotStock.length > 0) {
                hotStock.hide();
            }
        } else {
            if (disable) {
                this.item.removeClass('isChecked');
                quantityInput.attr('disabled', true);
                alertBox.find('.alertBox-message').text(window.variantStrings.soldOut_message);
                alertBox.show();

                this.item.find('.quantity__message').empty().hide();

                if (notifyMe.length > 0) {
                    notifyMe.find('.halo-notify-product-variant').val(this.currentVariant.title);
                    notifyMe.find('.notifyMe-text').empty();
                    notifyMe.slideDown('slow');
                }
            } else {
                this.item.addClass('isChecked')
                quantityInput.attr('disabled', false);
                alertBox.find('.alertBox-message').text('');
                alertBox.hide();

                if (notifyMe.length > 0) {
                    notifyMe.slideUp('slow');
                }
            }
        }

        // if (this.item[0]) {
        //     this.item[0].dataset.inStock = this.currentVariant.available ? 'true' : 'false';
        // }
    }

    getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
        return this.variantData;
    }

    updateAddToCartButton() {
        const editCartWrapper = this.variantSelect.closest('[data-template-cart-edit]');
        if (!editCartWrapper) return
        const productItems = [...editCartWrapper.querySelectorAll('.product-edit-item')];
        const updateEditCartButton = this.variantSelect.closest('[data-edit-cart-popup]').querySelector('[data-update-cart-edit]');
        const allValid = productItems.every(productItem => productItem.dataset.inStock == 'true');

        if (allValid) {
            updateEditCartButton.disabled = false
        } else {
            updateEditCartButton.disabled = true
        }
    }

    setInputAvailability(optionInputs, optionInputsValue, availableOptionInputsValue) {
        optionInputs.forEach(input => {
            if (availableOptionInputsValue.includes(input.getAttribute('value'))) {
                input.classList.remove('soldout');
                input.innerText = input.getAttribute('value');
            } else {
                input.classList.add('soldout');
                optionInputsValue.includes(input.getAttribute('value')) ? input.innerText = input.getAttribute('value') + ' (Sold out)' : input.innerText = window.variantStrings.unavailable_with_option.replace('[value]', input.getAttribute('value'))
            }
        });
    }
}

customElements.define('variant-edit-selects', VariantEditCartSelects);

class VariantEditCartRadios extends VariantEditCartSelects {
    constructor() {
        super();
    }

    setInputAvailability(optionInputs, optionInputsValue, availableOptionInputsValue) {
        optionInputs.forEach(input => {
            if (availableOptionInputsValue.includes(input.getAttribute('value'))) {

                input.nextSibling.classList.remove('soldout', 'unavailable');
                input.nextSibling.classList.add('available');
            } else {

                input.nextSibling.classList.remove('available', 'unavailable');
                input.nextSibling.classList.add('soldout');

                if (window.variantStrings.hide_variants_unavailable && !optionInputsValue.includes(input.getAttribute('value'))) {
                    input.nextSibling.classList.add('unavailable')
                    if (!input.checked) return;
                    let inputsValue;
                    availableOptionInputsValue.length > 0 ? inputsValue = availableOptionInputsValue : inputsValue = optionInputsValue;
                    input.closest('.product-form__input').querySelector(`input[value="${inputsValue[0]}"]`).checked = true;
                    this.dispatchEvent(new Event('change'))
                }
            }
        });
    }

    updateOptions() {
        const fieldsets = Array.from(this.querySelectorAll('fieldset'));
        this.options = fieldsets.map((fieldset) => {
            return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
        });
    }
}

customElements.define('variant-edit-radios', VariantEditCartRadios);

class QuantityEditCartInput extends HTMLElement {
    constructor() {
        super();
        this.input = this.querySelector('input');
        this.changeEvent = new Event('change', { bubbles: true })
        this.item = $(this.input).closest('.product-edit-item');
        this.input.addEventListener('change', this.onInputChange.bind(this));
        this.querySelectorAll('.btn-quantity').forEach(
            (button) => button.addEventListener('click', this.onButtonClick.bind(this))
        );
    }

    onButtonClick(event) {
        event.preventDefault();
        var inputValue = this.input.value;
        var maxValue = parseInt(this.input.dataset.inventoryQuantity);
        const value = Number(this.input.value);
        if (event.target.classList.contains('plus')) {
            var newVal = value + 1;
        } else {
            var newVal = value - 1;
        }

        if (inputValue < 1) {
            newVal = 1;
            this.input.value = newVal;
        }

        if (inputValue > maxValue) {
            var arrayInVarName = `quick_view_selling_array_${this.input.dataset.product}`,
                itemInArray = window[arrayInVarName],
                itemStatus = itemInArray[currentId];

            if (itemStatus == 'deny') {
                newVal = maxValue
                this.input.value = newVal;
                const message = getInputMessage(maxValue);
                showWarning(message, 3000);
            }
        }

        this.input.value = newVal;
        this.input.dispatchEvent(this.changeEvent);
    }

    onInputChange(event) {
        event.preventDefault();
        var inputValue = Number(this.input.value);
        var inventoryQuantity = Number(this.input.dataset.quantity);

        if (inputValue < 1) {
            inputValue = 1;
            this.input.value = inputValue;
        } else {
            if (inventoryQuantity < inputValue) {
                var message = window.inventory_text.warningQuantity.replace('[inventory]', inventoryQuantity);

                inputValue = inventoryQuantity;
                this.input.value = inputValue;

                this.item.find('.quantity__message').text(message).show();
                this.item.removeClass('isChecked');
            } else {
                this.item.addClass('isChecked');
                this.item.find('.quantity__message').empty().hide();
            }
        }
    }
}

customElements.define('quantity-edit-cart-input', QuantityEditCartInput);