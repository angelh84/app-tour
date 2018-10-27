var dropDownModule = function () {
    var S,
        _parent,
        _children,
        _selectionBox,
        _selectionBoxText,
        _closeAssign,
        _hiddenAssign;

    var _init = function(settings) {
        S = settings;
        _parent            = typeof S._parent != 'string' ? $('.dropParent') : $(S._parent);
        _children          = typeof S._children != 'string' ? $('.dropChildren') : $(S._children);
        _selectionBox      = typeof S._selectionBox != 'string' ? $('.dropSelectBox') :  $(S._selectionBox);
        _selectionBoxText  = typeof S._selectionBoxText != 'string' ? $('.dropSelectBoxText') : $(S._selectionBoxText);
        _closeAssign       = typeof S._closeAssign != 'string' ? 'closed' : S._closeAssign;
        _hiddenAssign      = typeof S._hiddenAssign != 'string' ? 'hidden' : S._hiddenAssign;

        bindEvents();
    };

    var bindEvents = function() {
        initialUIActions();
        dropHandler();
        dropSelectEvent(S.selectCallback);
        docClickHideEvent();
        winResizeHideEvent();
    };

    var initialUIActions = function() {
        var initParentHeightSet = _children.outerHeight() + _selectionBox.outerHeight();
        var initDropTopOffset = _children.outerHeight() - _selectionBox.outerHeight();
        _children.hide().css( 'top', -initDropTopOffset );
        _parent.css( 'height', initParentHeightSet );
    };

    var dropHandler = function() {
        _selectionBox.on('click', function() {
            if ( $(this).hasClass(_closeAssign) ){
                dropOpen()
            } else {
                dropHide();
            }
        });
    };

    var dropOpen = function() {
        _selectionBox.removeClass(_closeAssign);
        _children.show().stop().animate({ top: _selectionBox.outerHeight() });
    };

    var dropHide = function(childClickActions, callback, e) {
        _selectionBox.addClass(_closeAssign);
        _children.stop().animate({
            top: -( _children.outerHeight() - _selectionBox.outerHeight() )
        }, function() {
            typeof childClickActions === 'function' ? childClickActions() :  $(this).hide();
            typeof callback === 'function' ? callback(e) : null;
        });

    };
    
    var dropSelectEvent = function(callback) {
        _children.find('a').on('click', function(e) {
            var $this = $(this);
            var clickedElmText = $this.text();
            dropHide( childClickActions, callback, e );

            function childClickActions() {
                _selectionBoxText.text( clickedElmText );
                $this.parent().addClass( _hiddenAssign ).siblings().removeAttr( 'class' );
                _children.hide();
            }
        });
    };

    var docClickHideEvent = function() {
        $(document).on('click', function(e) {
            if ( !$(e.target).parents( '.' + _parent.attr( 'class' ) ).length ) {
               dropHide();
            }
        });
    };

    var winResizeHideEvent = function() {
        $(window).on( 'resize', function() {
            if ( !_selectionBox.hasClass( _closeAssign ) ) {
                dropHide();
            }
        });
    };

    return {
        init : _init
    };

}; // END dropDownModule