var tourModule = function(){
    var settings;
    var $currentSlide;
    var $nextSlide;
    var $nextTarget;
    var nextSlideInteger;

    var initialize = function(appSettings) {
        settings = appSettings;
        initialUIActions();
    };

    var initialUIActions = function () {
        settings.tourContainer.show();
        settings.firstStep.addClass(settings.currentClass);
        setTimeout(function(){
            settings.tourBG.css('opacity', 1);
        }, 250);
        setTimeout(function(){
            settings.tourStepBox.css('opacity', 1).addClass('slide-1-active');
        }, 500);
    };

    var nextSlideActions = function () {
        nextSlideNum();
        $nextTarget = settings.targetObjects[nextSlideInteger - 2];
        $currentSlide = $('#' + currentSlideID());
        $nextSlide = $('#slide-' + nextSlideInteger);

        if ( nextSlideInteger <= settings.slideContent.length ) {
            slideFadeOut( animateToNextSlide );
        } else {
            exitActions();
        }
    };

    var slideFadeOut = function ( callback ) {
        settings.tourArrow.fadeOut();
        settings.tourSlideCount.fadeOut();
        $('.' + settings.targetClass).removeClass(settings.targetClass);
        $currentSlide.fadeOut( callback );
    };

    var animateToNextSlide = function () {
        slideCount();
        settings.tourStepBox.removeClass('slide-' + (nextSlideInteger - 1) + '-active');
        settings.tourStepBox.addClass('slide-' + nextSlideInteger + '-active');
        setTimeout(function () {
            slideFadeIn();
            offScreenAnimation();
        }, 200);
    };

    var offScreenAnimation = function () {
        var targetBoxHeight = $nextTarget.outerHeight();
        var targetBoxTopOffset = $nextTarget.offset().top;
        var slideBoxTopOffset = settings.tourStepBox.offset().top;
        var winHeight = $(window).height();
        var winScrollTop = $(window).scrollTop();

        if ( targetBoxTopOffset + targetBoxHeight > winHeight ) {
            $('html, body').animate({ scrollTop : slideBoxTopOffset - 155 });
        } else if (  winScrollTop + 95 > slideBoxTopOffset + 95 ) {
            $('html, body').animate({ scrollTop : slideBoxTopOffset - 200 });
        }
    };

    var slideFadeIn = function ( callback ) {
        $currentSlide.removeClass(settings.currentClass);
        settings.tourArrow.fadeIn();
        settings.tourSlideCount.fadeIn();
        $nextSlide.fadeIn( callback ).addClass(settings.currentClass);
        setTimeout(function(){
            $nextTarget.addClass(settings.targetClass);
        }, 125);
    };

    var currentSlideID = function () {
        return $('.' + settings.currentClass).attr('id');
    };

    var nextSlideNum = function () {
        var currentNum = currentSlideID().replace('slide-', '');
        nextSlideInteger = parseInt(currentNum, 10) + 1;
        return nextSlideInteger;
    };

    var slideCount = function () {
        var count = settings.slideContent.length - 1;
        var currentSlide = currentSlideID().replace('slide-', '');
        settings.tourSlideCount.text(currentSlide + '/' + count);
    };

    var exitActions = function () {
        settings.tourStepBox.css('opacity', 0);
        setTimeout(function(){
            $('body, html').animate({ scrollTop : 0 });
            settings.tourBG.css('opacity', 0);
        },250);
        window.location.href = settings.finishedRedirect;
    };

    return {
        init : initialize,
        nextSlide : nextSlideActions,
        closeTour : exitActions,
        winScrollAdjust : offScreenAnimation
    };
};
