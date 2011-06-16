(function ( $ ){

var wrappers = {
	toggle:    "<div class='qnxwidget qnxtoggle'><div class='slider'></div><div class='onlabel'>ON</div><div class='offlabel'>OFF</div></div>",
	checkbox:  "<div class='qnxwidget qnxcheckboxholder'><div class='qnxcheckbox'><div class='check'></div></div></div>"
};

function qnxToggle () {
	var toggle = this,
		on = toggle.prop( "checked" ),
		wrapper = $( wrappers.toggle );

	wrapper
		.toggleClass( "on blue", on )
		.insertAfter( toggle )
		.append( toggle.hide() )
		.bind( "click" , function () {
			on = !on;
			
			wrapper.toggleClass( "on", on ).toggleClass( "off", !on );
			toggle.prop( "checked", on );
			
			window.setTimeout( function () {
				wrapper.toggleClass( "blue", on );
			}, 350 );
		});
}

function qnxCheckbox () {
	var checkbox = this,
		wrapper = $( wrappers.checkbox ),
		on = checkbox.prop( "checked" ),
		check = wrapper.find( ".check" ).toggleClass( "hidden", !on );
	
	wrapper
		.insertAfter( checkbox )
		.append( checkbox.hide() )
		.click( function () {
			on = !on;
			check.toggleClass( "hidden", !on );
			checkbox.prop( "checked", on );
		});
}


$.fn.qnxwidget = function ( options ) {
	return this.each( function ( i, el ) {
		var widget = $( el );
		if ( widget.is( "input[type='submit'], input[type='button'], button" ) ) {
			widget.button();
		}
		
		if ( widget.is( "input[type='text'], input[type='email']" ) ) {
			widget.textfield();
		}
		if ( widget.is( "input[type='range']" ) ) {
			widget.slider();
		}		
		if ( widget.is( "input[type='checkbox'].toggle") ) {
			qnxToggle.call( widget );
		}
		
		if ( widget.is( "input[type='checkbox']:not(.toggle)") ) {
			qnxCheckbox.call( widget );
		}
		
		if ( widget.is( "select" ) ) {
			widget.select();
		}
	});
};

$.fn.qnxwidget.defaults = {
	
};

}(jQuery));


$(document).ready(function() {	
	var qnxelements = $('.qnx');
	qnxelements.qnxwidget();
});