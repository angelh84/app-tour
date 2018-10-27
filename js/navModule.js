var navModule = function () {
    var S;
    var formHeight;
    
    var init = function(settings) {
        S = settings;
        bindEvents();
    };

    var bindEvents = function() {
        navButtonsEvent();
        contactEvents();
        mobileFormActions();
        docClickHideEvent();
        winResizeHideEvent();
        mobileNavActions();
    };

    var navButtonsEvent = function() {
        S.$navButtons.on('click', function(e) {
            e.preventDefault();
            navActionAssignment(this, closeCallback);
        });
    };

    var contactEvents = function() {
        var $contactForm = $(S.$contactForm);
        formHeight = getContactFormHeight($contactForm);
        contactUIActions($contactForm, formHeight);
        contactFormShow($contactForm);
        contactFormSubmit($contactForm);
        contactFormClose(formHeight, $contactForm);
    };

    var getContactFormHeight = function($form) {
        var questionsContainer = S['questions-btn'];
        var formHeight = questionsContainer.show().find($form).outerHeight();
        questionsContainer.removeAttr('style');
        return formHeight;
    };

    var contactUIActions = function($form) {
        $form.css('margin-top', -formHeight);
        S['questions-btn'].removeAttr('style');
    };

    var contactFormShow = function($form) {
        $(S.navDropClass + ' ' + '.contact').on('click', function(e){
            e.preventDefault();
            if (typeof zE != 'undefined') {
                zE.activate({hideOnClose: true});
            }
            //$form.siblings().hide();
            //$form.css('margin-top', 0);
        });
    };

    var contactFormSubmit = function($form) {
        $form.on('submit', function(e){
            e.preventDefault();
            $('.contactFieldset').fadeOut(function(){
                $('.submitSuccess').fadeIn();
            });
        });
    };

    var closeCallback = function($elm){
        if ( $elm.hasClass('questions-drop-container') ){
            $('.submitSuccess').removeAttr('style');
            $('.contactFieldset').removeAttr('style');
            S.$contactForm.css('margin-top', -formHeight).siblings().removeAttr('style');
        }
    };

    var contactFormClose = function () {
        $('.submitSuccess button').on('click', function(e){
            e.preventDefault();
            navActionAssignment( $('#questions-btn'), closeCallback );
        });
    };

    var menuHide = function( $dropElm, callback ) {
        var dropHideVal = $dropElm.height() - $(S.dropTopOffset).outerHeight();
        $dropElm.stop().animate({ opacity: 0, top: -dropHideVal }, function() {
            $dropElm.hide();
            if ( typeof callback === 'function' ) {
                callback($dropElm);
            }
         });
    };

    var menuShow = function( $dropElm ) {
        var topOffset = $(S.dropTopOffset).outerHeight();
        $dropElm.show().stop().animate({ opacity: 1, top: topOffset });
    };

    var toggleBtnActiveClass = function ( $btn ) {
        var rawActiveClass = S.navActiveClass.replace('.', '');
        $btn.toggleClass( rawActiveClass );
        $( S.navActiveClass ).not( $btn ).removeClass( rawActiveClass );
    };

    var navActionAssignment = function( btn, callback ) {
        var $btn = $(btn);

        if ( $( S.navDropClass ).is(':visible') ) {
            menuHide( $( S.navDropClass + ':visible' ), callback );
        }
        if ( !$btn.hasClass( S.navActiveClass.replace('.', '') ) ) {
            menuShow( S[$btn.attr('id')] );
        }

        toggleBtnActiveClass( $btn );
    };

    var mobileNavActions = function() {
        S.$mobileNavBtn.on('click', function(e){
            if ( S.$mobileNavBtn.find('.fa').hasClass('fa-bars') ) {
                mobileNavShow();
            } else {
                mobileNavHide();
            }
        });
    };

    var mobileNavShow = function () {
        S.$mobileNavBtn.children('i').attr('class', 'fa fa-close');
        S.$mobileNavBox.stop().slideToggle(function() {
            S.mobileNavFlag = true;
        });
    };

    var mobileNavHide = function (callback) {
        S.$mobileNavBtn.children('i').attr('class', 'fa fa-bars');
        S.$mobileNavBox.stop().slideToggle(function() {
            S.$mobileNavBox.removeAttr('style');
            if ( typeof callback === 'function' ) {
                callback();
            }
        });
    };

    var mobileFormShow = function() {
        //S.$mobileContactForm.slideDown();
        if (typeof zE != 'undefined') {
            zE.activate({hideOnClose: true});
        }
    };

    var mobileFormHide = function() {
        S.$mobileContactForm.slideUp();
    };

    var mobileFormActions = function() {
        S.$mobileNavBox.find(S.$mobileContactBtn).on('click', function() {
            mobileNavHide(mobileFormShow);
        });
        S.$mobileContactClose.on('click', function() {
            mobileFormHide();
        });
    };

    var docClickHideEvent = function() {
        $(document).on('click', function(e) {
            var $eTarget = $(e.target);

            if (
                !$eTarget.parents(S.navDropClass).length &&
                !$eTarget.parents(S.docEventHideClass).length &&
                !$eTarget.parents('.help-box').length &&
                $( S.navActiveClass ).length
            ) {
                menuHide($('.navDropElm:visible'), closeCallback);
                toggleBtnActiveClass( $(S.navActiveClass) );
            }

            if (
                !$eTarget.parents('.nav').length &&
                S.$mobileNavBox.is(':visible') &&
                S.$mobileNavBtn.is(':visible')
            ) {
                mobileNavHide();
            }

            if (
                S.$mobileContactForm.is(':visible') &&
                !$eTarget.parents('.nav-box').length &&
                !$eTarget.parents('.help-box').length
            ) {
                mobileFormHide();
            }

        });
    };

    var winResizeHideEvent = function() {
        $(window).on('resize', function(){
            var $navActive = $(S.navActiveClass);

            if ( $navActive.length ) {
                menuHide($('.navDropElm:visible'), closeCallback);
                toggleBtnActiveClass( $navActive );
            }

            if (
                $('.mobile-nav').is(':visible') &&
                S.$mobileNavBox.is(':visible') &&
                S.mobileNavFlag
            ) {
                S.mobileNavFlag = false;
                mobileNavHide();
            }

            if ( S.$mobileContactForm.is(':visible') ) {
                mobileFormHide();
            }
        });

    };

    return {
        // settings
        init : init({
            'questions-btn'     : $('.questions-drop-container'),
            'cart-btn'          : $('.cart-drop-container'),
            'user-btn'          : $('.user-drop-container'),
            mobileNavFlag       : true,
            dashboardHelpBtn    : '.dashboard-help-btn',
            dropTopOffset       : '.header-container',
            navActiveClass      : '.active',
            navDropClass        : '.navDropElm',
            docEventHideClass   : '.docEventHide',
            $navButtons         : $('.header-user-buttons button'),
            $mobileNavBtn       : $('.mobile-nav'),
            $mobileNavBox       : $('.nav-box'),
            $mobileNavParent    : $('.nav'),
            $mobileContactBtn   : $('.contact'),
            $contactForm        : $('#contact-form-desktop'),
            $mobileContactForm  : $('.contact-form-mobile-container'),
            $mobileContactClose : $('.mobile-contact-close')
        })
    };

}; // END navModule