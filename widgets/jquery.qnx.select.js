(function ( $ ) {

var wrapper = "<div class='qnxselectwrapper relative'></div>",
	select_markup = [
		'<div class="qnxselectholder">',
			'<div class="qnxselectinner">',
				'<div class="qnxselectright">',
					'<div class="arrowholder">',
						'<div class="arrow"></div>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'].join( "\n"),
	dropdown_markup = [
		'<div class="qnxselectdropdown hidden">',
			'<ul></ul>',
		'</div>'].join( "\n" );

$.widget( "qnx.select", {
	
	select: null,
	dropdown: null,
	
	option_items: null,
	option_data: null,
	
	dropdown_showing: false,
	
	_create: function () {
		this.element.addClass( "hidden" );
		// this.parent = this.element.parent();
		
		this.select = $( select_markup ).insertAfter( this.element );
		this.dropdown = $( dropdown_markup ).insertAfter( this.select );
		this.label = $( '<span class="qnxselectedtext">' ).appendTo( this.select.find( ".qnxselectinner" ) );
	
		this._initEvents();
		this.reloadOptions();
	},
	
	_initEvents: function () {
		var that = this, showOnUp = false;
		
		this.select
		.bind( "touchstart mousedown", function ( e ){
			showOnUp = !that.dropdown_showing;
		})
		.bind( "touchend mouseup", function ( e ) {
			if ( !that.dropdown_showing && showOnUp ){
				that.show();
			}
		});
		
		this.dropdown.delegate( "li", "touchstart mousedown", function ( e ) {
			e.stopPropagation();
		});
		
		this.dropdown.delegate( "li", "touchend mouseup", function ( e ) {
			that.selectByIndex( $( this ).index() );
			that.select.triggerHandler( "click" );
		});
		
		this.element.bind( "change." + this.widgetName, function () {
			that.selectByIndex( this.selectedIndex );
		});
	},
	
	show: function () {
		this.dropdown_showing = true;
		
		this.option_items
			.removeClass( "active" )
			.eq( this.selectedIndex )
				.addClass( "active" );
		
		this.dropdown.toggleClass( "hidden", false );
		this.select.toggleClass( "active", true );
		
		var that = this;
		
		$( document ).one( "touchstart mousedown", function () {
			that.hide();
		});
	},
	
	hide: function () {
		this.dropdown.toggleClass( "hidden", true );
		this.select.toggleClass( "active", false );
		this.dropdown_showing = false;
	},
	
	
	reloadOptions: function () {
		var data = [],
		selectedIndex = 0,
		options = this.element.find( "option" ).map( function ( i, el ) {
			var opt = $( el );
			
			data.push( { val: opt.val(), label: opt.html() } );
			
			if ( opt.is( ":selected" ) ) {
				selectedIndex = i;
			};
			
			return "<li>" + el.innerHTML + "</li>";
		}).get().join("");
		
		this.option_data = data;
		
		
		this.dropdown.find( "ul" ).html( options );
		this.option_items = this.dropdown.find( "li" );
		
		this.refresh();
		this.selectByIndex( selectedIndex );
	},
	
	refresh: function () {
		var selectWidth = 0,
			ul = this.dropdown.find( "ul" ).css( "width", "" ),
			position = this.select.position();
		
		this.dropdown.removeClass( "hidden" );
		selectWidth = ul.outerWidth();
		this.dropdown.addClass( "hidden" );
		
		ul.css( "width", selectWidth + 35 );
		this.dropdown.css( {
			"left": position.left,
			"top": position.top + this.select.outerHeight()
		});
		this.select.css( "width", selectWidth );
		
	},
	
	selectByIndex: function ( index ) {
		var display = this.option_data[ index ] || {} ;
		this.label.html( display.label || "" );
		this.selectedIndex = index;
		this.element.selectedIndex = index;
	},
	
	// Runs cleanup. Automatically removes bound events
	// that were attached with the correct namespace
	destroy: function () {
		// Remove the wrapper
		this.element.removeClass( "hidden" );
		
		this.dropdown.remove();
		this.select.remove();
		
		$.Widget.prototype.destroy.apply( this, arguments ); // Call 'super'
	}
});

}( jQuery ));