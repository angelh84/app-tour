var tourModule = function(){
    var S;
    var $currentSlide;
    var $nextSlide;
    var $nextTarget;
    var nextSlideInteger;

    var initialize = function(settings) {
        S = settings;
        initialUIActions();
    };

    var initialUIActions = function () {
        S.tourContainer.show();
        S.firstStep.addClass(S.currentClass);
        setTimeout(function(){
            S.tourBG.css('opacity', 1);
        }, 250);
        setTimeout(function(){
            S.tourStepBox.css('opacity', 1).addClass('slide-1-active');
        }, 500);
    };

    var nextSlideActions = function () {
        nextSlideNum();
        $nextTarget = S.targetObjects[nextSlideInteger - 2];
        $currentSlide = $('#' + currentSlideID());
        $nextSlide = $('#slide-' + nextSlideInteger);

        if ( nextSlideInteger <= S.slideContent.length ) {
            slideFadeOut( animateToNextSlide );
        } else {
            exitActions();
        }
    };

    var slideFadeOut = function ( callback ) {
        S.tourArrow.fadeOut();
        S.tourSlideCount.fadeOut();
        $('.' + S.targetClass).removeClass(S.targetClass);
        $currentSlide.fadeOut( callback );
    };

    var animateToNextSlide = function () {
        slideCount();
        S.tourStepBox.removeClass('slide-' + (nextSlideInteger - 1) + '-active');
        S.tourStepBox.addClass('slide-' + nextSlideInteger + '-active');
        setTimeout(function () {
            slideFadeIn();
            offScreenAnimation();
        }, 200);
    };

    var offScreenAnimation = function () {
        var targetBoxHeight = $nextTarget.outerHeight();
        var targetBoxTopOffset = $nextTarget.offset().top;
        var slideBoxTopOffset = S.tourStepBox.offset().top;
        var winHeight = $(window).height();
        var winScrollTop = $(window).scrollTop();

        if ( targetBoxTopOffset + targetBoxHeight > winHeight ) {
            $('html, body').animate({ scrollTop : slideBoxTopOffset - 155 });
        } else if (  winScrollTop + 95 > slideBoxTopOffset + 95 ) {
            $('html, body').animate({ scrollTop : slideBoxTopOffset - 200 });
        }
    };

    var slideFadeIn = function ( callback ) {
        $currentSlide.removeClass(S.currentClass);
        S.tourArrow.fadeIn();
        S.tourSlideCount.fadeIn();
        $nextSlide.fadeIn( callback ).addClass(S.currentClass);
        setTimeout(function(){
            $nextTarget.addClass(S.targetClass);
        }, 125);
    };

    var currentSlideID = function () {
        return $('.' + S.currentClass).attr('id');
    };

    var nextSlideNum = function () {
        var currentNum = currentSlideID().replace('slide-', '');
        nextSlideInteger = parseInt(currentNum, 10) + 1;
        return nextSlideInteger;
    };

    var slideCount = function () {
        var count = S.slideContent.length - 1;
        var currentSlide = currentSlideID().replace('slide-', '');
        S.tourSlideCount.text(currentSlide + '/' + count);
    };

    var exitActions = function () {
        S.tourStepBox.css('opacity', 0);
        setTimeout(function(){
            $('body, html').animate({ scrollTop : 0 });
            S.tourBG.css('opacity', 0);
        },250);
        window.location.href = S.finishedRedirect;
    };

    return {
        init : initialize,
        nextSlide : nextSlideActions,
        closeTour : exitActions,
        winScrollAdjust : offScreenAnimation
    };
};
