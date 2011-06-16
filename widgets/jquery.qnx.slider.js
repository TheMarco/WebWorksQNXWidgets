(function ( $ ) {

var wrapper = "<div class='qnxslider qnxwidget'></div>",
indicatorleft_markup = '<div class="qnxsliderleft" style="width: 0"></div>',
indicatorright_markup = '<div class="qnxsliderright">';

$.widget( "qnx.slider", {
	options: {
		disabled: false
	},
	_create: function () {
		var initialvalue = this.element.attr('value');
		this.size = this.element.attr('data-size');
		this.element
			.wrap( wrapper )
			.css('width', this.size + 'px');
		this.parent = this.element.parent();		
		this.parent
			.css('width', this.size + 'px')
			.prepend( indicatorleft_markup )
			.append( indicatorright_markup );
		
		if ( this.element.attr( "disabled" ) ) {
			this.options.disabled = true;
		}

		this._initEvents();
		this.refresh();
	},
	
	_setMarkers: function() {
		var element;
		if(this.element == undefined) 
		{element = $(this)} 
		else 
		{element = $(this.element)}
		var leftMarkerWidth = Math.floor((element.val() / (element.attr('max') - element.attr('min'))) * element.attr('data-size')),
		rightMarkerWidth = element.attr('data-size') - leftMarkerWidth;
		element.parent().find('.qnxsliderleft').css('width', leftMarkerWidth - 2 + 'px');
		element.parent().find('.qnxsliderright').css('width', rightMarkerWidth - 2 + 'px');
		if(leftMarkerWidth < 2) {
			element.parent().addClass('moveleft');
		}
		else {
			element.parent().removeClass('moveleft');
		}
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
		var that = this;
		this.element.bind('change', this._setMarkers);
		// stuff comes here
	},
	
	refresh: function () {
		this.parent.toggleClass( "disabled", this.options.disabled );
		this.element[ this.options.disabled ? "attr" : "removeAttr"]( "disabled", true );
		this._setMarkers();
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