class DeferredMedia extends HTMLElement {
    constructor() {
        super();
        this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener('click', this.loadContent.bind(this));
    }

    loadContent() {
        if (!this.getAttribute('loaded')) {
            const templateContent = this.querySelector('template').content.cloneNode(true);
            const content = document.createElement('div');
            content.appendChild(templateContent);

            this.setAttribute('loaded', true);
            window.pauseAllMedia();
            
            const elements = content.querySelectorAll('video, model-viewer, iframe');
            elements.forEach(element => {
                if (window.innerWidth < 551){
                    element.classList.contains('slide-mb') && this.appendChild(element);
                } else{
                    element.classList.contains('slide-pc') && this.appendChild(element);
                }
            });
        }
    }
}

customElements.define('deferred-media', DeferredMedia);