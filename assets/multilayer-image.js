if (typeof MultilayerImage === 'undefined') {
    class MultilayerImage extends HTMLElement {
        constructor() {
            super();
    
            const firstItem = this.querySelector('.image-item:first-child');
    
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('item-active');
                  observer.unobserve(entry.target);
                }
              });
            }, {
              threshold: 0.1,
              rootMargin: '-100px 0px'
            });
            
            observer.observe(firstItem);
    
            $(this).find('.image-item').on('mouseenter', function() {
                if(!$(this).hasClass("item-active")){
                    $(this).parent().find('.image-item.item-active').removeClass('item-active');
                    $(this).addClass("item-active");
                }
            });
    
        }
    }
    
    customElements.define('multilayer-image', MultilayerImage);
}