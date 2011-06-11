(function ( $ ) {

function getBounds( el, padding ) {
	var offset = el.offset();

	padding = padding || 0;

	return {
		top: offset.top - padding,
		left: offset.left - padding,
		right: offset.left + el.outerWidth() + padding,
		bottom: offset.top + el.outerHeight() + padding
	};
}

function inBounds ( bounds, pageX, pageY ) {
	return ( pageX >= bounds.left && pageX <= bounds.right && pageY >= bounds.top && pageY <= bounds.bottom );
}

// Only use this in a touchstart handler
$.fn.enableTouchEnter = function ( padding ) {
	return this.each( function ( i, el ) {
		var $el = $( el ),
			bounds = getBounds( $el, padding ),
			inside = true;

		$el.bind( "touchmove.qnxtouch", function ( e ) {
			e = e.originalEvent;
			if ( e.touches && e.touches.length ) {
				if ( inBounds( bounds, e.touches[0].pageX, e.touches[0].pageY ) !== inside ) {
					inside = !inside;
					$el.trigger( "touch" + ( inside ? "enter" : "leave" ) );
				}	
			}
		});
	});
};

$.fn.disableTouchEnter = function () {
	return this.each( function ( i, el ) {
		$( el ).unbind( "touchmove.qnxtouch" );
	});
};

}( jQuery ));