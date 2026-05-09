(function ($) {
	var halo = {
	    initBrandsSlider: function() {
	        var brandsSlider = $('[data-brands-slider]');

	        brandsSlider.each(function () {
	            var self = $(this),
	            	dataArrows = self.data('arrows'),
	            	dataDots = self.data('dots'),
					dataCenterMode = self.data('center-mode'),
					itemsToShow = parseInt(self.data('rows')),
					autoplay = self.data('autoplay'),
					autoplaySpeed = self.data('autoplay-speed'),
					itemTotal = self.find('.halo-item').length;

	            if (self.not('.slick-initialized')) {
	                self.slick({
	                    slidesToShow: itemsToShow,
	                    slidesToScroll: 1,
	                    dots: dataDots && itemTotal > itemsToShow,
						get infinite() {
						    if (autoplay == true) {
						        return this.infinite = true;
						    } else {
						    	return this.infinite = dataCenterMode;
						    }
						},
						centerMode: dataCenterMode && itemTotal > itemsToShow,
						centerPadding: "10%",
	                    speed: 800,
						arrows: dataArrows,
	                    nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        autoplay: autoplay,
  						autoplaySpeed: autoplaySpeed,
                        rtl: window.rtl_slick,
	                    responsive: [{
	                            breakpoint: 1200,
	                            settings: {
									infinite: false,
									centerMode: dataCenterMode && itemTotal > 4,
	                                slidesToShow: itemsToShow - 1,
	                                slidesToScroll: itemsToShow - 1,
	                                arrows: dataArrows,
									dots: dataDots && itemTotal > 4
	                            }
	                        },
	                        {
	                            breakpoint: 768,
	                            settings: {
									centerMode: dataCenterMode && itemTotal > 3,
	                                slidesToShow: 3,
	                                slidesToScroll: 3,
	                                arrows: dataArrows,
									dots: dataDots && itemTotal > 3
	                            }
	                        },
	                        {
	                            breakpoint: 480,
	                            settings: {
	                                get slidesToShow() {
	                                	return this.slidesToShow = self.data('rows-mobile'); 
	                                },
	                                get slidesToScroll() {
	                                	return this.slidesToScroll = self.data('rows-mobile'); 
	                                },
	                                arrows: dataArrows,
									dots: dataDots && itemTotal > parseInt(self.data('rows-mobile'))
	                            }
	                        }
	                    ]
	                });
					self.slick('setPosition');
	            }
	        });
	    }
	}
	halo.initBrandsSlider();
	if ($('body').hasClass('cursor-fixed__show')){
		window.sharedFunctionsAnimation.onEnterButton();
		window.sharedFunctionsAnimation.onLeaveButton();
	}
})(jQuery);
