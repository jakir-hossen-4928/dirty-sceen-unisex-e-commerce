(function ($) {
	var halo = {
	    initBrandsSlider: function() {
	        var brandsSliderFor = $('[data-brands-slider-for]');
	        var brandsSliderNav = $('[data-brands-slider-nav]');

	        brandsSliderFor.each(function () {
	            var self = $(this),
					itemsToShow = parseInt(self.data('rows')),
					autoplay = self.data('autoplay');

	            if (self.not('.slick-initialized')) {
	                self.slick({
	                    slidesToShow: 1,
	                    slidesToScroll: 1,
	                    dots: false,
	                    arrows: true,
	                    infinite: false,
	                    speed: 800,
	                    nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        autoplay: autoplay,
  						autoplaySpeed: 3000,
                        rtl: window.rtl_slick,
                        asNavFor: '[data-brands-slider-nav]',
                        responsive: [
                        	{
	                            breakpoint: 767,
	                            settings: {
	                                arrows: false
	                            }
	                        }
                        ]
	                });
	            }
	        });

	        brandsSliderNav.each(function () {
	            var self = $(this),
	            	itemsToShow = parseInt(self.data('rows'));

	            if (self.not('.slick-initialized')) {
	                self.slick({
					   	slidesToShow: itemsToShow,
					   	slidesToScroll: 1,
					   	asNavFor: '[data-brands-slider-for]',
					   	dots: false,
					   	arrows: false,
					   	focusOnSelect: true,
					   	rtl: window.rtl_slick,
					   	responsive: [
					   		{
	                            breakpoint: 1280,
	                            settings: {
	                                slidesToShow: 3	                            
	                            }
	                        },
	                        {
	                            breakpoint: 992,
	                            settings: {
	                                slidesToShow: 3
	                            }
	                        },
	                        {
	                            breakpoint: 767,
	                            settings: {
	                                slidesToShow: 2,
	                                dots: true,
	                            }
	                        }
	                    ]
					});
	            }
	        });
	    }
	}
	halo.initBrandsSlider();
})(jQuery);

