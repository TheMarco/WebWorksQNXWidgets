(function ( $ ) {

var wrapper = "<div class='qnxbuttonholder qnxwidget'></div>";

$.widget( "qnx.button", {
	options: {
		preventScroll: true, // Not implemented
		disabled: false
	},
	_create: function () {
		this.element.wrap( wrapper );

		this.parent = this.element.parent();
		
		if ( this.element.attr( "disabled" ) ) {
			this.options.disabled = true;
		}

		this._initEvents();
		this.refresh();
	},

	// Helper function to update the display of the button
	_class: function ( down ) {
		this.parent.toggleClass( "active", down );
	},
	
	_setOption: function( key, value ) {
		if ( key === "disabled" ) {
			this.options.disabled = value; // Prevent using the Widget factory's default
			this.refresh();
			return;
		}
		
		$.Widget.prototype._setOption.apply( this, arguments );
	},

	_initEvents: function () {
		var that = this, bounds, inside = false;

		this.element
			// On mouse down, we start listening for enter and leave events
			.bind( "touchstart." + this.widgetName + " mousedown." + this.widgetName, function ( e ) {
				if ( that.options.disabled ) {
					return;
				}
				
				// TODO: button breaks if scrolling is allowed
				// following option is forced to on
				// if ( true || that.options.preventScroll ) {
					e.preventDefault();
				// }
				
				// Update visual display to on
				that._class( true );
				inside = true;
			
				that.element
					.bind( "touchenter." + this.widgetName + " mouseenter." + this.widgetName, function () {
						// User has left the button area, turn it off
						that._class( true );
						inside = true;
					})
					.bind( "touchleave." + this.widgetName + " mouseleave." + this.widgetName, function () {
						// User has reentered the button area, turn it on
						that._class( false );
						inside = false;
					})
					.enableTouchEnter( 10 );
				
			
				// Regardless of if this button will fire a click event
				// we need to be sure to unbind our hover events
				$( document ).one( "mouseup." + this.widgetName + " touchend." + this.widgetName, function () {
					if ( inside ) {
						that.element.trigger( "click" );
					};
					
					that._class( false );
					that.element.unbind( 
						"mouseleave." + this.widgetName + " mouseenter." + this.widgetName +
						" touchleave." + this.widgetName + " touchenter." + this.widgetName
					).disableTouchEnter();
				});
			});
		
	},
	
	refresh: function () {
		this.parent.toggleClass( "disabled", this.options.disabled );
		this.element[ this.options.disabled ? "attr" : "removeAttr"]( "disabled", true );
	},

	// Runs cleanup. Automatically removes bound events
	// that were attached with the correct namespace
	destroy: function () {
		// Remove the wrapper
		this.element.unwrap();
		$.Widget.prototype.destroy.apply( this, arguments ); // Call 'super'
	}
});

}( jQuery ));