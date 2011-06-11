(function ( $ ){

var wrapper = "<div class='qnxwidget qnxtextfieldholder'></div>";

$.widget( "qnx.textfield", {
	options: {
		showClear: true
	},
	
	clearButton: null,
	
	_create: function () {
		this.element.wrap( wrapper );
		this.parent = this.element.parent();
		
		this._initEvents();
	},
	
	_initEvents: function () {
		var that = this, focussed = false;
		
		// Handle clicking on the clear button
		this.parent
			// We bind on mousedown so focus can remain in the
			// textarea when tapped
			.delegate( ".closecross", "mousedown", function ( e ) {
				that.option( "value", "" );
				return false; // Cancel propagation and default
			});
		
		this.element
			// Add a focused class on focus
			.bind( "focus." + this.widgetName, function () {
				focused = true;
				that.parent.addClass( "focused" );
			})
			
			// On blur, wait a split second, then remove the
			// focused class
			.bind( "blur." + this.widgetName, function () {
				focused = false;
				window.setTimeout( function () {
					// Sanity check in case a focus happens
					// within 200 ms of blurring
					if ( focused === false ) {
						that.parent.removeClass( "focused" );
					}
				}, 200 );
			})
			
			// Refresh on key up and change
			.bind( "keyup." + this.widgetName + " change." + this.widgetName, function () {
				that.refresh();
			});
	},
	
	_setOption: function ( key, value ) {
		$.Widget.prototype._setOption.apply( this, arguments );
		
		switch ( key ) {
			case "value":
				this.element.val( value );
				// falls through to the next item
				// so it will refresh
			case "showClear":
				this.refresh();
				break;
		}
	},
	
	refresh: function () {
		// Add clearButton if needed
		if ( this.options.showClear && !this.clearButton ) {
			this.clearButton = $( "<div class='closecross'></div>" ).appendTo( this.parent );
		}
		
		// Remove clearButton if needed
		if ( !this.options.showClear && this.clearButton ) {
			this.clearButton.remove();
			this.clearButton = null;
		}
		
		// Update visual state
		if ( this.clearButton ) {
			this.clearButton[ this.value() === "" ? "hide" : "show" ]();
		}
	},
	
	value: function () {
		return $.trim( this.element.val() );
	},
	
	destroy: function () {
		this.clearButton.remove();
		this.element.unwrap();
		$.Widget.prototype.destroy.apply( this, arguments );
	}
});

}( jQuery ));