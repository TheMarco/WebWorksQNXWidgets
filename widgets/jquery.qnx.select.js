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
	options: {
		disabled: false
	},
	
	
	select: null,
	dropdown: null,
	
	option_items: null,
	option_data: null,
	
	dropdown_showing: false,
	
	eventCache: null,
	
	_create: function () {
		this.element.addClass( "hidden" );
		
		this.eventCache = {};
		
		this.select = $( select_markup ).insertAfter( this.element );
		this.dropdown = $( dropdown_markup ).insertAfter( this.select );
		this.label = $( '<span class="qnxselectedtext">' ).appendTo( this.select.find( ".qnxselectinner" ) );
	
		if ( this.element.attr( "disabled" ) ) {
			this.options.disabled = true;
			this.select.addClass( "disabled" );
		}
	
		this._initEvents();
		this.reloadOptions();
	},
	
	_class: function ( active ) {
		this.select.toggleClass( "active", active );
	},
	
	_initEvents: function () {
		var that = this, showOnUp = false, inside = false;
		
		this.select
			.bind( "touchstart mousedown", function ( e ){
				if ( that.options.disabled ) {
					return; // This control is already disabled
				}
				
				bounds = $.qnx.getBounds( that.select );
				
				that.select.enableTouchEnter();
				
				inside = true;
				that._class( true );
				
				that.select
					.bind( "touchenter mouseenter", $.debounce( 50, true, function ( e ) {
						inside = true;
						that._class( true );
					}))
					.bind( "touchleave mouseleave", $.debounce( 50, true, function ( e ) {
						inside = false;
						that._class( false );
					}));
				
				that.select.trigger( "selecttouch" );
				
				$( document )
					.one( "touchend mouseup", function ( e ) {
						if ( inside ) {
							that.select.trigger( "click" );
						}

						inside = false;

						that.select
							.unbind( "touchenter touchleave mouseenter mouseleave")
							.disableTouchEnter();
					});
				
				return false; // Cancel scroll, and stop propagation
			})
			.bind( "click", $.debounce( 50, true, function ( e ) {
				if ( that.options.disabled ) {
					return;
				}
				
				if ( that.dropdown_showing && that.eventCache.hide ) {
					that.eventCache.hide();
				} else if ( !that.dropdown_showing ) {
					that.show();
				}
			}));
			
		
		
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
		this.select.toggleClass( "down", true );
		
		var that = this;
		
		this.eventCache.hide = function ( e ) {
			if ( e && e.target === that.select[0] ) {
				return; // Don't hide on the same control
			}
			
			that.hide();
			$( document ).unbind( "selecttouch touchstart mousedown", that.eventCache.hide );
			that.eventCache.hide = null;
		};
		
		$( document ).bind( "touchstart mousedown selecttouch", this.eventCache.hide );
	},
	
	hide: function () {
		this.dropdown.toggleClass( "hidden", true );
		this.select.toggleClass( "down", false );
		this.select.toggleClass( "active", false );
		this.dropdown_showing = false;
	},
	
	_setOption: function( key, value ) {
		if ( key === "disabled" ) {
			this.options.disabled = value; // Prevent using the Widget factory's default
			this.select.toggleClass( "disabled", value );
			return;
		}
		
		$.Widget.prototype._setOption.apply( this, arguments );
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