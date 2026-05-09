class AgeVerificationPopup extends HTMLElement {
    constructor() {
        super();

        this.popup = this;
        this.timeToShow = parseInt(this.popup.getAttribute('data-delay'));
        this.expiresDate = this.popup.getAttribute('data-expire');
        if (this.getCookie('age-verification-popup') === ''){
            var popup = this.popup;

            setTimeout(function() {
                document.body.classList.add('age-verification-show');
            }, this.timeToShow);
        }

        this.querySelector('[data-close-age-verification-popup]').addEventListener(
            'click',
            this.setClosePopup.bind(this)
        );
    }

    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
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

    setClosePopup() {
        this.setCookie('age-verification-popup', 'closed', this.expiresDate);
        document.body.classList.remove('age-verification-show');
    }
}

customElements.define('age-verification-popup', AgeVerificationPopup);