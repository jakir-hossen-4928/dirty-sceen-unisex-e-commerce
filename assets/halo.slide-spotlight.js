(function ($) {
    var halo = {
        initSpotlightSlider: function() {
            var spotlightBlock = $('[data-spotlight-slider]');
            
            spotlightBlock.each(function() {
                var self = $(this),
                    dataRows = self.data('rows'),
                    dataRowsMb = self.data('rows-mb'),
                    dataArrows = self.data('arrows'),
                    dataArrowsMB = self.data('arrows-mb'),
                    dataDots = self.data('dots'),
                    dataDotsMB = self.data('dots-mb'),
                    dataSwipe = self.data('swipe'),
                    dataCenterMode = self.data('center-mode');
                    
                if ((dataSwipe == 'list' || dataSwipe == 'scroll') && window.innerWidth < 768) return;
                self.slick({
                    infinite: true,
                    centerMode: false,
                    speed: 1000, 
                    arrows: dataArrows,
                    dots: dataDots,
                    nextArrow: window.arrows.icon_next,
                    prevArrow: window.arrows.icon_prev,
                    slidesToShow: dataRows,
                    slidesToScroll: 1,
                    rtl: window.rtl_slick,
                      responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                get slidesToShow() {
                                    if(dataCenterMode){
                                        return this.slidesToShow = dataRowsMb;
                                    } else {
                                        return this.slidesToShow = 2;
                                    }
                                },
                                get centerMode() {
                                    if(dataCenterMode){
                                        return this.centerMode = true;
                                    } else {
                                        return this.centerMode = false;
                                    }
                                },
                                get centerPadding() {
                                    if(dataCenterMode){
                                        return this.centerPadding = '137px';
                                    }
                                },
                                arrows: dataArrowsMB,
                                dots: dataDotsMB
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: dataRowsMb,
                                get centerMode() {
                                    if(dataCenterMode){
                                        return this.centerMode = true;
                                    } else {
                                        return this.centerMode = false;
                                    }
                                },
                                get centerPadding() {
                                    if(dataCenterMode){
                                        return this.centerPadding = '0px';
                                    }
                                },
                                arrows: dataArrowsMB,
                                dots: dataDotsMB
                            }
                        }                                          
                      ]
                });
            });
        }
    }
    halo.initSpotlightSlider();
    if ($('body').hasClass('cursor-fixed__show')){
        window.sharedFunctionsAnimation.onEnterButton();
        window.sharedFunctionsAnimation.onLeaveButton();
    }
})(jQuery);