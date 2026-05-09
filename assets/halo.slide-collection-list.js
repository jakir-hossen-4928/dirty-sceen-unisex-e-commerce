(function ($) {
    var halo = {
        initCollectionListSlider: function () {
            var instagramBlock = $('[data-collection-list-slider]');

            instagramBlock.each(function () {
                var self = $(this),
                    dataRows = self.data('rows'),
                    dataSlideRow = self.data('slide-rows'),
                    dataArrow = self.data('arrow'),
                    dataColumn = self.data('column'),
                    dataDots = self.data('dots'),
                    dataLimit = self.data('limit');

                if (dataSlideRow == 2) {
                    var x = self.children();
                    for (i = 0; i < x.length; i += 2) {
                        x.slice(i, i + 2).wrapAll('<div class="' + i + '"></div>');
                    }
                }

                self.slick({
                    infinite: false,
                    speed: 1000,
                    arrows: dataArrow,
                    dots: dataDots,
                    nextArrow: window.arrows.icon_next,
                    prevArrow: window.arrows.icon_prev,
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    rtl: window.rtl_slick,
                    mobileFirst: true,
                    responsive: [
                        {
                            breakpoint: 551,
                            settings: "unslick"
                        },
                        {
                            breakpoint: 320,
                            settings: {
                                get slidesPerRow() {
                                    if (dataSlideRow == 2) {
                                        this.slidesPerRow = 1,
                                            this.rows = 2
                                    }
                                },
                                get slidesToScroll() {
                                    if (dataSlideRow == 1) {
                                        return this.slidesToScroll = 1
                                    }
                                },
                                get slidesToShow() {
                                    return this.slidesToScroll = 1
                                },
                                get initialSlide() {
                                    return this.initialSlide = 0;
                                }
                            }
                        }
                    ]
                });
            });
        }
    }
    halo.initCollectionListSlider();
    if ($('body').hasClass('cursor-fixed__show')) {
        window.sharedFunctionsAnimation.onEnterButton();
        window.sharedFunctionsAnimation.onLeaveButton();
    }
})(jQuery);