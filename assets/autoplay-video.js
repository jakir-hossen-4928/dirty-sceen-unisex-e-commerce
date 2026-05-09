(function ($) {
    var halo = {
        sectionVideo: function () {
            var slickSlideshow = $('.video-section');
            if (slickSlideshow.length) {
                const loadVideo = () => slickSlideshow.each((index, element) => {
                    var $block = $(element);
                    const postVideo = function postMessageToPlayer(player, command) {
                        if (player == null || command == null) return;
                        player.contentWindow.postMessage(JSON.stringify(command), "*");
                    }
                    var player = $block.find('.js-youtube').get(0);
                    postVideo(player, {
                        "event": "command",
                        "func": "playVideo"
                    });
                    
              });

              window.addEventListener('load', () => {
                    loadVideo();
                    window.addEventListener('scroll', loadVideo);
              });
            };
        },

        autoplayOnScroll: function () {
            const widgetSection = $('.cust-prod-widget');
            if (widgetSection.length > 0) {
                const poster = widgetSection.find(".cust-prod-widget__item--video-poster")
                $.fn.isInViewport = function() {
                    let elementTop = $(this).offset().top,
                        elementBottom = elementTop + $(this).outerHeight(),
                  
                        viewportTop = $(window).scrollTop(),
                        viewportBottom = viewportTop + $(window).height();
                  
                    return elementBottom > viewportTop && elementTop < viewportBottom;
                };

                const postVideo = function postMessageToPlayer(player, command) {
                    if (player == null || command == null) return;
                    player.contentWindow.postMessage(JSON.stringify(command), "*");
                }

                const loadVideo = () => widgetSection.each((index, element) => {
                    const $block = $(element),
                        playerYt = $block.find('.js-youtube').get(0),
                        playerVimeo = $block.find('.js-vimeo').get(0),
                        playerMp4 = $block.find(".js-video").get(0);

                    if (playerYt){
                        postVideo(playerYt, {
                            "event": "command",
                            "func": "playVideo"
                        });
                    }

                    if (playerVimeo){
                        postVideo(playerVimeo, {
                            method: "play" 
                        });
                    }

                    if (playerMp4) {
                        playerMp4.play()
                    }
                });
                
                const pauseVideo = () => widgetSection.each((index, element) => {
                    const $block = $(element),
                        playerYt = $block.find('.js-youtube').get(0),
                        playerVimeo = $block.find('.js-vimeo').get(0),
                        playerMp4 = $block.find(".js-video").get(0);

                    if (playerYt){
                        postVideo(playerYt, {
                            "event": "command",
                            "func": "pauseVideo"
                        });
                    }

                    if (playerVimeo){
                        postVideo(playerVimeo, {
                            method: "pause" 
                        });
                    }

                    if (playerMp4) {
                        playerMp4.pause()
                    }
                });

                window.addEventListener('scroll', () => {
                    const videoSection = widgetSection;

                    videoSection.each(function(){
                        $('body, html').trigger('click');
                        if ($(this).isInViewport()) {
                            if ($(this).find('video').length > 0 || $(this).find('iframe').length > 0){
                                poster.addClass("is-hide")
                            }
                            loadVideo();
                        } else {
                            pauseVideo()
                        }
                    });
              });
            }
        }
    }
    halo.sectionVideo();
    halo.autoplayOnScroll();
})(jQuery);
