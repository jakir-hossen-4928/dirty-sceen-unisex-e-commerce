class CursorFixed extends HTMLElement {
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
    window.sharedFunctionsAnimation = {
      onEnterButton: this.onEnterButton.bind(this),
      onLeaveButton: this.onLeaveButton.bind(this),
    };

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
    const buttons = document.querySelectorAll(".button, .button *, button, select, a, .glyphicon, .slick-arrow, .cartTool-item, .arrow-icon-scroll, .recently-viewed-icon")
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

    const links = document.querySelectorAll(".link, .link *")
    links.forEach(link => {
      link.addEventListener("pointerenter", (e) => {
        this.onEnterDefault();
      });
    })

    const iconHeader = document.querySelectorAll(".header__iconItem, .header__icon")
    iconHeader.forEach(icon => {
      icon.addEventListener("pointerenter", (e) => {
        this.onEnterDefault();
      });
    })
  }

  onLeaveButton(){
    const buttons = document.querySelectorAll(".button, .button *, button, select, a, .glyphicon, .slick-arrow, .cartTool-item, .arrow-icon-scroll, .recently-viewed-icon")
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

    const links = document.querySelectorAll(".link, .link *")
    links.forEach(link => {
      link.addEventListener("pointerout", (e) => {
        this.onLeaveDefault()
      });
    })

    const iconHeader = document.querySelectorAll(".header__iconItem, .header__icon")
    iconHeader.forEach(icon => {
      icon.addEventListener("pointerout", (e) => {
        this.onLeaveDefault()
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

customElements.define('cursor-fixed', CursorFixed);

class CursorBlur extends HTMLElement {
  constructor() {
    super();
  
    this.pos = { x: 0, y: 0 };
    this.ratio = 0.65;

    this.isStuck = false;
    this.mouse = {
      x: -100,
      y: -100,
    };

    this.cursorBlur = this.querySelector(".cursor--blur");
  }

  connectedCallback(){
    this.init()
  }

  init() {
    document.addEventListener("pointermove", this.updateCursorPosition.bind(this))
  }


  getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min + 1)) + min;
  }

  updateCursorPosition(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    this.pos.x += (this.mouse.x - this.pos.x) * this.ratio;
    this.pos.y += (this.mouse.y - this.pos.y) * this.ratio;
  
    gsap.to(this.cursorBlur, { 
      duration: 0.15,
      x: this.pos.x,
      y: this.pos.y,
      xPercent: -50, 
      yPercent: -50,
    });
  }
}

customElements.define('cursor-blur', CursorBlur);