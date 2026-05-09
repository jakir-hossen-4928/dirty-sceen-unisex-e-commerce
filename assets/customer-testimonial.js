if (typeof CustomerTestimonial === 'undefined') {
    class CustomerTestimonial extends HTMLElement {
        constructor() {
            super();
            $(this).find('.customer-testimonial').slick({
                infinite: true,
                centerMode: $(this).find('.customer-testimonial').hasClass('center-mode'),
                centerPadding: '170px',
                speed: 1000,
                arrows: true,
                dots: false,
                nextArrow: window.arrows.icon_next,
                prevArrow: window.arrows.icon_prev,
                slidesToShow: 2,
                slidesToScroll: 1,
                rtl: window.rtl_slick,
                responsive: [
                    {
                        breakpoint: 1300,
                        settings: {
                            centerMode: false,
                        }
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            centerMode: false,
                            slidesToShow: 1
                        }
                    }
                ]
            });
            
        }
    }
    
    customElements.define('customer-testimonial', CustomerTestimonial);
    }