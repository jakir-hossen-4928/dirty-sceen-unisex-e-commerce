class PuzzledImageBanner extends HTMLElement {
    constructor() {
        super();
        var self = $(this);
        let blockLeft = self.find('.content-block-left');
        let blockRight = self.find('.content-block-right');
        if (window.innerWidth < 1025) {
            blockRight.children().appendTo(blockLeft);
            blockLeft.slick({
                infinite: true,
                centerMode: true,
                centerPadding: '0px',
                speed: 1000,
                arrows: true,
                dots: true,
                adaptiveHeight: true,
                nextArrow: window.arrows.icon_next,
                prevArrow: window.arrows.icon_prev,
                slidesToShow: 1,
                slidesToScroll: 1,
                rtl: window.rtl_slick
            });
        }

        $(window).on('resize', function() {
            blockLeft = self.find('.content-block-left');
            blockRight = self.find('.content-block-right');
            if (window.innerWidth < 1025) {
                if (!blockLeft.hasClass('slick-initialized')) {
                    blockRight.children().eq(0).appendTo(blockLeft);
                    blockRight.children().eq(0).appendTo(blockLeft);
                    blockLeft.slick({
                        infinite: true,
                        centerMode: true,
                        centerPadding: '0px',
                        speed: 1000,
                        arrows: true,
                        dots: true,
                        adaptiveHeight: true,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        rtl: window.rtl_slick
                    });
                }
            } else {
                blockLeft.children().eq(2).appendTo(blockRight);
                blockLeft.children().eq(2).appendTo(blockRight);
                if (blockLeft.hasClass('slick-initialized')) {
                    blockLeft.slick('unslick');
                }
            }
        });
    }
}
  
customElements.define('puzzled-image-banner', PuzzledImageBanner);