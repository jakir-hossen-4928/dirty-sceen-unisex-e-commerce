class CookieConsent extends HTMLElement {
	constructor() {
		super();  

        this.cookie = this;

		if (this.getCookie('cookie-consent') === ''){
            this.cookie.style.display = "block";

			if(this.cookie.classList.contains('full-width')){
                var cookieHeight = this.cookie.offsetHeight;

                if(cookieHeight > 0){
                    document.body.style.paddingBottom = cookieHeight + "px";
                }

                var w = window.innerWidth;

                window.addEventListener('resize', () => {
                    if (window.innerWidth == w) {
                        return
                    }

                    w = window.innerWidth;

                    var cookieHeight = this.cookie.offsetHeight;

                    if(cookieHeight > 0){
                        document.body.style.paddingBottom = cookieHeight + "px";
                    }
                });
            }
		} else {
			this.remove();
		}

		this.querySelector('[data-accept-cookie]').addEventListener(
            'click',
            this.setClosePopup.bind(this)
        );
	}

	setCookie(cname, cvalue) {
        document.cookie = cname + '=' + cvalue + ';path=/';
    }

	getCookie(cname) {
        const name = cname + '=';
        const ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        
        return '';
    }

    deleteCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    setClosePopup(event) {
        event.preventDefault();
        
        this.setCookie('cookie-consent', 'closed');
        this.cookie.remove();

        if(this.cookie.classList.contains('full-width')){
            document.body.style.paddingBottom = "0px";
        }
    }
}

customElements.define('cookie-consent', CookieConsent);