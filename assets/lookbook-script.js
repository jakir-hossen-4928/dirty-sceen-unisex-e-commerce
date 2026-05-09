if (typeof lookbookDialogRef === 'undefined') {
    class LookbookDialogDot extends HTMLElement {
        constructor() {
            super();
        }
        
        connectedCallback() {
            this.RESERVED_SPACE = 20;
            this.left = 0;
            this.top = 0;
            this.inLeftHalf = true;
    
            this.dialog = this.querySelector('[data-lookbook-dialog]');
            this.productItem = this.querySelector('.product-item');
    
            // a product card doens't have close button, 
            // but lookbook product card does
    
            this.closeDialogButton = this.querySelector('[data-close-lookbook-dialog-button]');
            this.productItem.appendChild(this.closeDialogButton);
    
            if (window.innerWidth > 1024) { 
                this.addEventListener('click', this.toggleDialog.bind(this));
            } else {
                this.closeDialogButton.style.display = 'none';
            }
    
            window.addEventListener('resize', this.onResize.bind(this));
        }           
    
        onResize() {
            if (window.innerWidth > 1024) { 
                this.removeEventListener('click', this.toggleDialog.bind(this));
                this.addEventListener('click', this.toggleDialog.bind(this));
    
                this.closeDialogButton.style.display = 'block';
            } else {    
                this.removeEventListener('click', this.toggleDialog.bind(this));
                this.closeDialogButton.style.display = 'none';
            }
    
            if (this.dialog.hasAttribute('open')) this.closeDialog();
        }
    
        resetPosition() {
            this.left = 0;
            this.top = 0;
            this.setPosition();
        }   
    
        toggleDialog(e) {
            if (window.innerWidth <= 1024) return;
    
            if (e.target.matches('[data-close-lookbook-dialog-button]')){
                if (document.body.classList.contains('cursor-fixed__show')){
                    document.body.classList.remove('active-cursor-fixed');
                }
                return this.closeDialog();
            }

            if (this.checkIsQuickshop3(e)) return this.closeDialog();
            if (this.checkIsQuickView(e)) return this.closeDialog();
    
            if (e.target.closest('.product-item') || e.target.matches('.product-item')) return;
            if (this.dialog.hasAttribute('open')) {
                if (document.body.classList.contains('cursor-fixed__show')){
                    document.body.classList.remove('active-cursor-fixed');
                }
                return this.closeDialog();
            }
    
            if (e.target.matches('.glyphicon')) {
                e.stopImmediatePropagation();
                if (document.body.classList.contains('cursor-fixed__show')){
                    document.body.classList.add('active-cursor-fixed');
                }
                this.openDialog();
            }
        }
    
        checkIsQuickshop3(e) {
            if (!document.body.classList.contains('quick_shop_option_3')) return false;
            return e.target.matches('[data-quickshop-popup]') || e.target.closest('[data-quickshop-popup]');
        }

        checkIsQuickView(e) {
            return e.target.matches('[data-open-quick-view-popup]') || e.target.closest('[data-open-quick-view-popup]') || e.target.matches('.card-quickview');
        }
    
        openDialog() {
            this.currentTop = window.scrollY;
    
            this.resetPosition();
            this.dialog.showModal();
            this.calculatePosition({ currentWindowTop: this.currentTop });
            this.setPosition();
    
            window.scrollTo({
                top: this.currentTop
            })
    
            this.productItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    
        closeDialog() {
            this.productItem.classList.add('closing');
    
            setTimeout(() => {
                this.resetPosition();
                this.dialog.close();
                this.productItem.classList.remove('closing');
            }, 500);
        }
    
        calculatePosition({ currentWindowTop }) {
            const lookbookDotBox = this.getBoundingClientRect();
            const dialogBox = this.productItem.getBoundingClientRect();
    
            if (window.innerWidth > 1024) {
                const { left: dotLeft, right: dotRight, top: dotTop, width: dotWidth } = lookbookDotBox;
                const { left: dialogLeft, top: dialogTop, width: dialogWidth, height: dialogHeight } = dialogBox;
    
                const axis = window.innerWidth / 2;
                const dotAxis = dotLeft + dotWidth / 2;
                if (dotAxis > axis) this.inLeftHalf = false;
    
                this.left = LookbookDialogDot.getLeft({
                    inLeftHalf: this.inLeftHalf,
                    reservedSpace: this.RESERVED_SPACE,
                    right: dotRight,
                    left: dotLeft,
                    dialogLeft,
                    dialogWidth
                });
    
                this.top = LookbookDialogDot.getTop({
                    top: dotTop,
                    dialogHeight,
                    dialogTop,
                    currentWindowTop,
                    reservedSpace: this.RESERVED_SPACE,
                });
               
            } else {
                this.top = 50;
                this.left = 50;
            }
        }
    
        setPosition() {
            this.productItem.style.setProperty('--top', this.top);
            this.productItem.style.setProperty('--left', this.left);
        }
    
        static getLeft(params) {
            const { inLeftHalf, reservedSpace, right, left, dialogLeft, dialogWidth } = params;
    
            let intendedLeft, deltaLeft;
    
            if (inLeftHalf) {
                // The popup will to the right of the dot if the dot is on the half left of the screen;
    
                intendedLeft = right + reservedSpace;
                deltaLeft = -1 * (dialogLeft - intendedLeft);
            } else {    
                // The popup will to the left of the dot if the dot is on the half right of the screen;
    
                intendedLeft = left - reservedSpace - dialogWidth;  
                deltaLeft = intendedLeft - dialogLeft;
            }
    
            return deltaLeft;
        }
    
        static getTop(params) {
            const { top, dialogHeight, reservedSpace, dialogTop, currentWindowTop } = params;
            let intendedTop, deltaTop;
    
            if (top + dialogHeight + reservedSpace > currentWindowTop + window.innerHeight) {
                // The popup will be far down relative to the dot if there's enough bottom space for it in the viewport;
    
                intendedTop = top - dialogHeight + reservedSpace;
                deltaTop = -1 * (dialogTop - intendedTop)
            } else {        
                // The popup will be far up relative to the dot if there's NOT enough bottom space for it in the viewport;
    
                intendedTop = top - reservedSpace;
                deltaTop = (intendedTop - dialogTop);
            }
    
            return deltaTop;
        }
    }
    
    class LookbookWrapper extends HTMLElement {
        constructor() {
            super()
        }
    
        connectedCallback() {
            this.lookbookIcons = [...this.querySelectorAll('[data-lookbook-icon]')];
            this.initialized = false;
    
            if (window.innerWidth <= 1024) {
                this.lookbookIcons.forEach((icon) => {
                    icon.addEventListener('click', this.onClick.bind(this));
                })
            }       
            window.addEventListener('resize', this.onResize.bind(this));
    
            setTimeout(() => {
                this.initialized = true;
            }, 150)
        }   
    
        onResize() {
            if (window.innerWidth <= 1024) {
                this.lookbookIcons.forEach(icon => {
                    icon.removeEventListener('click', this.onClick.bind(this));
                    icon.addEventListener('click', this.onClick.bind(this));
                })  
            } else {
                this.lookbookIcons.forEach(icon => {
                    icon.removeEventListener('click', this.onClick.bind(this));
                })
            }
        }
    
        onClick(e) {
            if (window.innerWidth > 1024 || !this.initialized) return;
            this.buildPopup(e);
        }
    
        buildPopup(e) {
            const icon = e.currentTarget;
            const currentIndex = this.lookbookIcons.indexOf(icon);
    
            this.lookbookIcons.forEach(icon => {
                const productItem = icon.querySelector('.product-item');
                const dialog = icon.querySelector('[data-lookbook-dialog]');
    
                if (productItem) {
                    const signature = `sig-${productItem.dataset.productId}-${Date.now().toString()}`;
    
                    dialog.dataset.signature = signature;
                    productItem.dataset.signature = signature;
                    
                    LookbookMobilePopup.appendItem(productItem);
                }
            })
    
            LookbookMobilePopup.togglePopup(true, currentIndex);
        }
    }
    
    class LookbookMobilePopup extends HTMLElement {
        constructor() {
            super();
        }
    
        connectedCallback() {
            this.contentWrapper = this.querySelector('[data-lookbook-mobile-images-container]');
            this.closeButton = this.querySelector('[data-close-lookbook-modal]');
    
            this.closeButton.addEventListener('click', () => {
                LookbookMobilePopup.togglePopup(false);
            })
            this.addEventListener('click', this.onSelfClick.bind(this));
            window.addEventListener('resize', this.onResize.bind(this));
        }
    
        onSelfClick(e) {
            if (e.target.tagName.toLowerCase() === 'lookbook-mobile-popup') {
                LookbookMobilePopup.togglePopup(false); 
                document.getElementById('halo-card-mobile-popup')?.classList.remove('show');
                document.body.classList.remove('quick_shop_popup_mobile');
            }
        }
    
        onResize() {
            LookbookMobilePopup.togglePopup(false);
        }
    
        static appendItem(item) {
            const contentWrapper = document.querySelector('[data-lookbook-popup-mobile] [data-lookbook-mobile-images-container]')
            contentWrapper.appendChild(item)
        }
    
        static togglePopup(isOpen, indexToScroll = 0) {
            const contentWrapper = document.querySelector('[data-lookbook-popup-mobile] [data-lookbook-mobile-images-container]');
    
            LookbookMobilePopup.checkAndSetOverflowing(contentWrapper);
            document.body.classList.toggle('mobile-popup-active', isOpen);
            
            if (isOpen) {
                setTimeout(() => {
                    document.querySelectorAll('[data-lookbook-popup-mobile] .product-item')[indexToScroll]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 400)
            } else {
                const items = contentWrapper.querySelectorAll('[data-signature]');
    
                setTimeout(() => {
                    items.forEach(item => {
                        const signature = item.dataset.signature;
                        const dialog = document.querySelector(`[data-lookbook-dialog][data-signature="${signature}"]`);
                        dialog.appendChild(item);
                    })
                }, 350)
            }
        }
    
        static checkAndSetOverflowing(contentWrapper = null) {
            if (!contentWrapper) return;
            contentWrapper.classList.toggle('center', contentWrapper.scrollWidth <= contentWrapper.clientWidth);
        }
    }

    class CursorFixedLookbook extends HTMLElement {
      constructor() {
        super();

        this.pos = { x: 0, y: 0 };
        this.ratio = 0.65;

        this.isStuck = false;
        this.mouse = {
          x: -100,
          y: -100,
        };

        this.cursorOuter = this.querySelector(".cursor--large");
        this.cursorInner = this.querySelector(".cursor--small");

        this.cursorOuterOriginalState = {
          width: this.cursorOuter.getBoundingClientRect().width,
          height: this.cursorOuter.getBoundingClientRect().height,
        };
      }

      connectedCallback() {
        if (window.matchMedia("(min-width: 1200px)").matches) {
          this.init();
          this.onEnterButton();
          this.onLeaveButton();
          this.onEnterDrawerOverlay();
          this.onLeaveDrawerOverlay();
        }

        window.matchMedia("(min-width: 1200px)").onchange = (event) => {
          if (event.matches) {
            this.init();
            this.onEnterButton();
            this.onLeaveButton();
            this.onEnterDrawerOverlay();
            this.onLeaveDrawerOverlay();
          } 
        }
      }

      init() {
        document.addEventListener("pointermove", this.moveOnSite.bind(this))
        document.addEventListener("pointerenter", this.moveOnSite.bind(this))
        document.addEventListener("pointerleave", this.moveOutSite.bind(this))
        document.addEventListener("pointerout", this.moveOutSite.bind(this))

        document.addEventListener("pointermove", this.updateCursorPosition.bind(this))
        document.addEventListener("pointerdown", this.pointerDown.bind(this))
        document.addEventListener("pointerup", this.pointerUp.bind(this))
      }

      moveOutSite(){
        gsap.to(this, 0.15, {
          opacity: 0,
        });
      } 

      moveOnSite(){
        gsap.to(this, 0.15, {
          opacity: 1,
        });
      }

      pointerDown(){
        if(!this.classList.contains("on-overlay")) {
          gsap.to(this.cursorInner, 0.15, {
            scale: 2,
          });

          gsap.to(this.cursorOuter, 0.15, {
            scale: 2,
          });
        }
      }

      pointerUp(){
        gsap.to(this.cursorInner, 0.15, {
          scale: 1,
        });

        gsap.to(this.cursorOuter, 0.15, {
          scale: 1,
        });

        if(this.classList.contains("on-overlay")) this.classList.remove("on-overlay")
      }
      
      onEnterDefault(){
        gsap.to(this.cursorInner, 0.15, {
          opacity:0
        });
        
        gsap.to(this.cursorOuter, 0.15, {
          scale: 2,
        });
      }

      onLeaveDefault(){
        gsap.to(this.cursorInner, 0.15, {
          opacity:1
        });
        
        gsap.to(this.cursorOuter, 0.15, {
          scale: 1,
        });
      }

      onEnterButton(){
        const buttons = document.querySelectorAll(".cartTool-item, .arrow-icon-scroll, .recently-viewed-icon")
        buttons.forEach(btn => {
          btn.addEventListener("pointerenter", (e) => {
            if(!btn.parentElement.classList.contains('cursor-fixed__parallax-inner')){
              this.onEnterDefault();
            }
          });
        })

        const cardProduct = document.querySelectorAll(".card-title, .media, .dropdown-label, .card-media, .card-compare")
        cardProduct.forEach(btn => {
          btn.addEventListener("pointerenter", (e) => {
            if(!btn.parentElement.classList.contains('cursor-fixed__parallax-inner')){
              this.onEnterDefault();
            }
          });
        })
      }

      onLeaveButton(){
        const buttons = document.querySelectorAll(".cartTool-item, .arrow-icon-scroll, .recently-viewed-icon")
        buttons.forEach(btn => {
          btn.addEventListener("pointerout", (e) => {
            if(!btn.parentElement.classList.contains('cursor-fixed__parallax-inner')){
              this.onLeaveDefault()
            }
          });
        })

        const cardProduct = document.querySelectorAll(".card-title, .card-title, .media, .dropdown-label, .card-media, .card-compare")
        cardProduct.forEach(btn => {
          btn.addEventListener("pointerout", (e) => {
            if(!btn.parentElement.classList.contains('cursor-fixed__parallax-inner')){
              this.onLeaveDefault()
            }
          });
        })
      }

      onEnterDrawerOverlay(){
        const overlays = document.querySelectorAll(".background-overlay")

          overlays.forEach(ovl => {
            ovl.addEventListener("pointermove", () => {
              this.classList.add("on-overlay")
              
              gsap.to(this.cursorOuter, 0.15, {
                scale: 2,
              });
            })
          })
      }

      onLeaveDrawerOverlay(){
        const overlays = document.querySelectorAll(".background-overlay")

        overlays.forEach(ovl => {
          ovl.addEventListener("pointerout", () => {
            this.classList.remove("on-overlay")
            
            gsap.to(this.cursorOuter, 0.15, {
              scale: 1,
            });
          })
        })
      }

      callParallax(e, parent) {
        this.parallaxIt(e, parent, 20);
      }

      parallaxIt(e, parent, movement) {
        const rect = parent.getBoundingClientRect();
        
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      

        gsap.to(parent, 0.3, {
          x: ((this.mouse.x - rect.width / 2) / rect.width) * movement,
          y: ((this.mouse.y - rect.height / 2) / rect.height) * movement,
          ease: "Power2.easeOut",
        });
      }

      updateCursorPosition(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        this.pos.x += (this.mouse.x - this.pos.x) * this.ratio;
        this.pos.y += (this.mouse.y - this.pos.y) * this.ratio;
        
        gsap.to(this.cursorInner, { 
          duration: 0.15,
          x: this.pos.x,
          y: this.pos.y,
          xPercent: -50, 
          yPercent: -50,
        });

        gsap.to(this.cursorOuter, {
          duration: 0.4,
          x: this.pos.x,
          y: this.pos.y,
          xPercent: -50, 
          yPercent: -50,
        });
      }
    }
    
    var lookbookDialogRef = LookbookDialogDot;
    
    window.addEventListener('load', () => {
        customElements.define('lookbook-dialog-dot', LookbookDialogDot);
        customElements.define('lookbook-wrapper', LookbookWrapper);
        customElements.define('lookbook-mobile-popup', LookbookMobilePopup);
        if (document.body.classList.contains('cursor-fixed__show')){
            customElements.define('cursor-fixed-lookbook', CursorFixedLookbook);
        }
    })
}