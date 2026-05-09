(function ($) {
	var halo = {
        initVideoLargeSlider: function() {
            var VideoLargeSliders = $('[data-video-carousel-slider]');

            VideoLargeSliders.each(function () {
                var self = $(this),
                    itemToShow = self.data('item-to-show'),
                    itemDots = self.data('item-dots'),
                    itemDotsMb = self.data('item-dots-mb'),
                    itemArrows = self.data('item-arrows'),
                    itemArrowsMb = self.data('item-arrows-mb'),
					itemTotal = self.find('.video-item').length;

                if (self.not('.slick-initialized')) {
                    self.slick({
                        slidesToShow: itemToShow,
                        slidesToScroll: 1,
                        swipeToSlide: true,
                        centerMode: itemTotal > itemToShow,
                        focusOnSelect: true,
                        cssEase: "ease",
                        arrows: itemArrows,
                        dots: itemDots,
                        speed: 300,
                        centerPadding: '42px',
                        infinite: true,
                        autoplaySpeed: self.data('autoplay-speed'),
                        autoplay: self.data('autoplay'),
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                        responsive: [
                        {
                            breakpoint: 1400,
                            settings: {
                                get slidesToShow() {
                                    if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                        if(itemToShow > 5){
                                            return this.slidesToShow = 5;
                                        } else{
                                            return this.slidesToShow = itemToShow;
                                        }
                                    } else {
                                        return this.slidesToShow = 1;
                                    }
                                },
                                get centerMode() {
                                    if(itemToShow > 5){
                                        return this.centerMode = itemTotal > 5;
                                    } else{
                                        return this.centerMode = itemTotal > itemToShow;
                                    }
                                },
                                arrows: itemArrows,
                                dots: itemDots,
                                centerPadding: '42px'
                            }
                        },
                        {
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: 3,
                                centerMode: itemTotal > 3,
                                arrows: itemArrows,
                                dots: itemDots,
                                centerPadding: '150px'
                            }
                        },
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 1,
                                centerMode: itemTotal > 1,
                                arrows: itemArrowsMb,
                                dots: itemDotsMb,
                                centerPadding: '150px'
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 1,
                                centerMode: itemTotal > 1,
                                arrows: itemArrowsMb,
                                dots: itemDotsMb,
                                centerPadding: '42px'
                            }
                        }]
                    });
                    self.slick('setPosition');
                }
            });
        }
	}
	halo.initVideoLargeSlider();
    if ($('body').hasClass('cursor-fixed__show')){
		window.sharedFunctionsAnimation.onEnterButton();
		window.sharedFunctionsAnimation.onLeaveButton();
	}
})(jQuery);
