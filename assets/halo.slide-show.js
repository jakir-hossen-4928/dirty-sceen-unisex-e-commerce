(function ($) {
  var halo = {
      initSlideshow: function () {
            var slickSlideshow = $('[data-init-slideshow]');
            if (slickSlideshow.length) {
                slickSlideshow.each(function () {
                    var self = $(this),
                        auto_playvideo = self.data('auto-video');

                    if (self.find('.item-video').length) {
                      var tag = document.createElement('script');
                      tag.src = "https://www.youtube.com/iframe_api";
                      var firstScriptTag = document.getElementsByTagName('script')[0];
                      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    }

                    if(auto_playvideo) {
                        // POST commands to YouTube or Vimeo API
                        function postMessageToPlayer(player, command) {
                            if (player == null || command == null) return;
                            player.contentWindow.postMessage(JSON.stringify(command), "*");
                        }

                        // When the slide is changing
                        function playPauseVideo(slick, control) {
                            var currentSlide, player, video;

                            currentSlide = slick.find('.slick-current .item ');
                            if($(window).width() > 1024) {
                              player = currentSlide.find("iframe.slide-pc").get(0);
                            } else {
                              player = currentSlide.find("iframe.slide-mobile").get(0);
                            }

                            if (currentSlide.hasClass('slide-youtube')) {
                              if($(window).width() > 1024) {
                                var id = currentSlide.find('iframe.slide-pc').attr('id');
                                var video_id = currentSlide.find('iframe.slide-pc').data('video-id');
                              } else {
                                var id = currentSlide.find('iframe.slide-mobile').attr('id');
                                var video_id = currentSlide.find('iframe.slide-mobile').data('video-id');
                              }
  
                               if (control === "play"){
                                    postMessageToPlayer(player, {
                                     "event": "command",
                                     "func": "playVideo"
                                   });
                                  self.slick('slickPause');
                                   $(player).on('ended', function() {
                                     postMessageToPlayer(player, {
                                       "event": "command",
                                       "func": "playVideo"
                                     });
                                     self.slick('slickPlay');
                                     self.slick('next');
                                   });
                                }
                               else {
                                  postMessageToPlayer(player, {
                                     "event": "command",
                                     "func": "pauseVideo"
                                   });
                               }
                               
                               var player1;
                               function onPlayerReady(event) {
                                 event.target.playVideo();
                               }

                                // when video ends
                               function onPlayerStateChange(event) { 
                                 if(event.data === 0) {
                                    postMessageToPlayer(player, {
                                       "event": "command",
                                       "func": "playVideo"
                                    });            
                                   self.slick('slickPlay');
                                   self.slick('next');
                                 }
                               }
                               function onYouTubePlayerAPIReady() {
                                    player1 = new YT.Player(id, {
                                      videoId: video_id,
                                      events: {
                                        'onReady': onPlayerReady,
                                        'onStateChange': onPlayerStateChange
                                      }
                                    });
                               }
                               
                               onYouTubePlayerAPIReady();

                            } else if (currentSlide.hasClass('slide-video')) {
                               video = currentSlide.find("video").get(0);

                               if (video != null) {
                                 if (control === "play"){
                                   video.play();

                                   self.slick('slickPause');
                                   $(video).on('ended', function() {
                                     self.slick('slickPlay');
                                     self.slick('next');
                                   });

                                 } else {
                                   video.pause();
                                 }
                               }
                            };
                        };

                        self.on('init', function(slick) {
                            slick = $(slick.currentTarget);

                            setTimeout(function(){
                                playPauseVideo(slick,"play");
                            }, 1000);

                            const slider = $(this);

                            if (slider.data('dot-with-image')) {
                                const plusIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 128 128" height="128px" id="Слой_1" version="1.1" viewBox="0 0 128 128" width="128px" xml:space="preserve" style="&#10;"><g><polygon fill="#1E3C32" points="127,59 69,59 69,1 59,1 59,59 1,59 1,69 59,69 59,127 69,127 69,69 127,69   "/></g></svg>`;
                                function updateDotsWithImages(slider, plusIcon, time) {
                                    setTimeout(function() {
                                        let dots = $('.slick-dots > li > button', slider);
                                        $.each(dots, function(i, e) {
                                            let dot_img = $('[aria-describedby="'+$(this).parent().attr('id')+'"]').data('dot-img');
                                            if(dot_img) 
                                                $(this).html('<img src="' + dot_img + '" alt="" />' + plusIcon);
                                            else
                                                $(this).html(plusIcon);
                                        });
                                    }, time);
                                }

                                updateDotsWithImages(slider,plusIcon,100);

                                window.matchMedia('(min-width: 1024px)').addEventListener('change', () => {
                                    updateDotsWithImages(slider,plusIcon, 500);
                                });

                                window.matchMedia('(min-width: 768px)').addEventListener('change', () => {
                                    updateDotsWithImages(slider,plusIcon, 500);
                                });

                                if (window.innerWidth < 1025 && slider.find('.slick-active .slide-content.enable_position_outside_image')) {
                                    changeDotsPosition(slider);
                                    $(window).on('resize', () => {
                                        changeDotsPosition(slider);
                                    });
                                }
                            }
                        });

                        function changeDotsPosition(slider) {
                          setTimeout(function() {
                              if(slider.find('.slick-active:has(.placeholder-svg)').length){
                                  slider.attr('style','--height-image-active:' + slider.find('.slick-active .placeholder-svg').height() + 'px');
                              } else{
                                  slider.attr('style','--height-image-active:' + slider.find('.slick-active .slide-mobile img').height() + 'px');
                              }
                          }, 500);
                        }

                        self.on("beforeChange", function(event, slick) {
                          slick = $(slick.$slider);
                          playPauseVideo(slick,"pause");

                          self.on("mouseenter focus", function (event, slick) {
                              $('.home-slideshow .slideshow').addClass('over_hover');
                          });
                        });

                        self.on("afterChange", function(event, slick) {
                          $('.item.slick-slide:not(.slick-current) .fluid-width-video-wrapper .video').css('display', 'none');
                          $('.slick-current .fluid-width-video-wrapper .video').css('display', 'block');
                          slick = $(slick.$slider);
                          playPauseVideo(slick,"play");
                          changeDotsPosition($(this));
                        });
                    };

                    if (self.not('.slick-initialized')) {
                        if (self.data('dots') == 'none') {
                          var dots = false;
                        } else {
                          var dots = true;
                        }
                        if (self.data('dots') == 'number') {
                          var arrowsMobile = true;
                          var customPaging = (self, i) => {let index = i + 1;var count = self.slideCount;return '<a class="dot" aria-label="'+index+'/'+count+'">'+index+'/'+count+'</a>';}
                        } else {
                          var arrowsMobile = false;
                        }
                        self.slick({
                            dots: dots,
                            slidesToScroll: 1,
                            verticalSwiping: false,
                            fade: self.data('fade'),
                            cssEase: "ease",
                            adaptiveHeight: true,
                            autoplay: self.data('autoplay'),
                            autoplaySpeed: self.data('autoplay-speed'),
                            arrows: self.data('arrows'),
                            nextArrow: window.arrows.icon_next,
                            prevArrow: window.arrows.icon_prev,
                            customPaging: customPaging,
                            rtl: window.rtl_slick,
                            speed: self.data('speed') || 500,
                            responsive: [{
                                breakpoint: 1024,
                                settings: {
                                    arrows: arrowsMobile,
                                    customPaging: customPaging,
                                    dots: true
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    arrows: arrowsMobile,
                                    customPaging: customPaging,
                                    dots: true
                                }
                            }
                            ]
                        });
                    };
                });
            };

            var videoAction = $('.slideshow .video-button');
            if (videoAction.length) {
                videoAction.each(function () {
                    videoAction.on("click", function () {
                        var videoItem = this.parentElement;
                        if(videoItem.querySelector('video')){
                            var video = videoItem.querySelector('video');
                            if (this.classList.contains('pause')){
                                video.play();
                                this.classList.remove('pause');
                                this.classList.add('play');
                            } else {
                                video.pause();
                                this.classList.remove('play');
                                this.classList.add('pause');
                            }
                        } else {
                            var tag = document.createElement('script');
                            tag.src = "https://www.youtube.com/iframe_api";
                            var firstScriptTag = document.getElementsByTagName('script')[0];
                            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                            function postMessageToPlayer(player, command) {
                                if (player == null || command == null) return;
                                player.contentWindow.postMessage(JSON.stringify(command), "*");
                            }

                            var player;

                            if($(window).width() > 1024) {
                                player = $(videoItem).find("iframe.slide-pc").get(0);
                            } else {
                                player = $(videoItem).find("iframe.slide-mobile").get(0);
                            }

                            if (this.classList.contains('pause')){
                                postMessageToPlayer(player, {
                                    "event": "command",
                                    "func": "playVideo"
                                });
                                this.classList.remove('pause');
                                this.classList.add('play');
                            } else {
                                postMessageToPlayer(player, {
                                    "event": "command",
                                    "func": "pauseVideo"
                                });
                                this.classList.remove('play');
                                this.classList.add('pause');
                            }
                        }
                    })
                    
                });
            };
        }
  }
  halo.initSlideshow();
  if ($('body').hasClass('cursor-fixed__show')){
    window.sharedFunctionsAnimation.onEnterButton();
    window.sharedFunctionsAnimation.onLeaveButton();
  }
})(jQuery);
