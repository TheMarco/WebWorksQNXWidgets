(function ( $ ) {

var wrapper = "<div class='qnxbuttonholder qnxwidget'></div>";

$.widget( "qnx.button", {
	_create: function () {
		this.element.wrap( wrapper );

		this.parent = this.element.parent();

		this._initEvents();
	},

	// Helper function to update the display of the button
	_class: function ( down ) {
		this.parent.toggleClass( "active", down );
	},

	_initEvents: function () {
		var that = this;

		this.element
			// On mouse down, we start listening for enter and leave events
			.bind( "mousedown." + this.widgetName, function () {
				// Update visual display to on
				that._class( true );

				that.element
					.bind( "mouseleave." + this.widgetName, function () {
						// User has left the button area, turn it off
						that._class( false );
					})
					.bind( "mouseenter." + this.widgetName, function () {
						// User has reentered the button area, turn it on
						that._class( true );
					});

				// Regardless of if this button will fire a click event
				// we need to be sure to unbind our hover events
				$( document ).one( "mouseup." + this.widgetName, function () {
					that._class( false );
					that.element.unbind( "mouseleave." + this.widgetName + " mouseenter." + this.widgetName );
				});
			});
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