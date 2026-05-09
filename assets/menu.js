function menuSidebarMobile() {
    var buttonIconOpen = $('.mobileMenu-toggle'),
        buttonClose = $('.halo-sidebar-close, .background-overlay');

    $(document).on('click', '.mobileMenu-toggle', function(event) {
        event.preventDefault();
        $('body').addClass('menu_open');
            if(window.mobile_menu == 'default'){
                if(!$('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').length){
                    $('.header .header__inline-menu').appendTo('#navigation-mobile .site-nav-mobile.nav');
                }
            }
            if(!$('#navigation-mobile .site-nav-mobile.nav-account .free-shipping-text').length){
                $('.header-top--wrapper .header-top--right .free-shipping-text').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
            }
            if(!$('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').length){
                $('.header-top--wrapper .header-top--right .customer-service-text').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
            }
            if(!$('#navigation-mobile .site-nav-mobile.nav-account .header__location').length){
                $('.header-top--wrapper .header-top--right .header__location').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
            }
            if(!$('#navigation-mobile .top-language-currency').length){
                if($('.header').hasClass('header-03')){
                    $('.header .header-bottom-right .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                }else if($('.header').hasClass('header-05')){
                    $('.header .header-top--left .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                }else{
                    $('.header .header-language_currency .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                }
            }
            // halo.productMenuSlider();
    });

    $(document).on('click', '.halo-sidebar-close, .background-overlay', function() {
        $('body').removeClass('menu_open');
        $('#navigation-mobile').off('transitionend.toggleCloseMenu').on('transitionend.toggleCloseMenu', () => {
            if (!$('body').hasClass('menu_open')) {

                if(!$('.header .header__inline-menu').length){
                    if($('.header').hasClass('header-03') || $('.header').hasClass('header-04') || $('.header').hasClass('header-07') || $('.header').hasClass('header-08')){
                        $('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').appendTo('.header .header-bottom--wrapper .header-bottom-left');
                    }else{
                        $('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').appendTo('.header .header-bottom--wrapper');
                    }
                }
                if(!$('.header-top--wrapper .header-top--right .free-shipping-text').length){
                    if(!$('.header-04').hasClass('style_2')){
                        $('#navigation-mobile .site-nav-mobile.nav-account .free-shipping-text').insertBefore('.header-top--wrapper .header-top--right .header__group');
                    }
                }
                if(!$('.header-top--wrapper .header-top--right .header__location').length){
                    $('#navigation-mobile .site-nav-mobile.nav-account .header__location').insertBefore('.header-top--wrapper .header-top--right .header__group');
                }
                if(!$('.header-top--wrapper .header-top--right .customer-service-text').length){
                    if($('.header').hasClass('header-03')){
                        $('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').insertBefore('.header-top--wrapper .header-top--right .header__group .header__icon--wishlist');
                    }else{
                        $('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').insertBefore('.header-top--wrapper .header-top--right .top-language-currency');
                    }
                }
                if(!$('.header-language_currency .top-language-currency').length){
                    if($('.header').hasClass('header-03')){
                        $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-bottom--wrapper .header-bottom-right .header-language_currency');
                    }else if($('.header').hasClass('header-04')){
                        $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-bottom--wrapper .header-bottom-right .header-language_currency');
                    }else if($('.header').hasClass('header-05')){
                        $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-top--wrapper .header-top--left .header-language_currency');
                    }else{
                        $('#navigation-mobile .site-nav-mobile .top-language-currency').insertBefore('.header .header-language_currency .header__search');
                    }
                }
            }
        })
            
    });

    $(document).on('click', '.halo-sidebar-close', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('body').removeClass('menu_open');
    });
}

menuSidebarMobile();