(function ( $ ){

var wrappers = {
	button:    "<div class='qnxbuttonholder qnxwidget'></div>",
	textField: "<div class='qnxwidget qnxtextfieldholder'><div class='closecross'></div></div>",
	toggle:    "<div class='qnxwidget qnxtoggle'><div class='slider'></div><div class='onlabel'>ON</div><div class='offlabel'>OFF</div></div>",
	checkbox:  "<div class='qnxwidget qnxcheckboxholder'><div class='qnxcheckbox'><div class='check'></div></div></div>"
};

function qnxButton ( ) {
	var button = this;
	
	button
		.wrap( wrappers.button )
		.bind( "mousedown mouseup", function ( e ) {
			button.parent().toggleClass( "active", e.type === "mousedown" );
		});
};

function qnxTextField () {
	var textField = this,
		wrapper = $( wrappers.textField );
	
	textField
		.after( wrapper )
		.appendTo( wrapper )
		.bind( "focus", function () {
			textField.parent().addClass( "focused" );
		})
		.bind( "blur", function () {
			window.setTimeout( function () {
				textField.parent().removeClass( "focussed" );
			}, 200 );
		});
		
	wrapper
		.delegate( ".closecross", "click", function ( e ) {
			textField.val( "" ).focus();
			e.preventDefault() && e.stopPropagation();
		});
}

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
			qnxButton.call( widget );
		}
		
		if ( widget.is( "input[type='text'], input[type='email']" ) ) {
			qnxTextField.call( widget );
		}
		
		if ( widget.is( "input[type='checkbox'].toggle") ) {
			qnxToggle.call( widget );
		}
		
		if ( widget.is( "input[type='checkbox']:not(.toggle)") ) {
			qnxCheckbox.call( widget );
		}
	});
};

$.fn.qnxwidget.defaults = {
	
};

}(jQuery));


function qnxwidget(type, element, args) {
	
	var element = element;
	var container = element.parent();
	var detachedElement, options, dropdownhtml;
	function buttonTouchStart(element) {
		$(element.parentNode).addClass('active');
	}
	function buttonTouchEnd(element) {
		$(element.parentNode).removeClass('active');
	}
	detachedElement = element.detach();
	switch(type) {
		case 'select':
		container.append(detachedElement.addClass('hidden'));
		container.html(container.html() + '<div class="qnxselectholder"><div class="qnxselectinner"><div class="qnxselectright"><div class="arrowholder"><div class="arrow"></div></div></div></div></div><div class="qnxselectdropdown hidden"><ul></ul></div>');
		options = element.find('option');
		activeItem = $(options[0]).html();
		dropdownhtml = '';
		for(i=0;i<options.length;i++) {
			dropdownhtml = dropdownhtml + '<li>' + $(options[i]).html() + '</li>';
			if($(options[i]).attr('selected')) {
				activeItem = $(options[i]).html();
			}
		}
		activeItem = '<span class="qnxselectedtext">' + activeItem + '</span>';
		container.addClass('relative');
		container.find('ul').html(dropdownhtml);
		container.find('.qnxselectinner').html(container.find('.qnxselectinner').html() + activeItem);
		container.find('.qnxselectdropdown').removeClass('hidden');
		selectWidth = container.find('.qnxselectdropdown ul').get(0).offsetWidth;
		container.find('.qnxselectdropdown').addClass('hidden').find('ul').attr('style', 'width:' + (selectWidth + 35) + 'px');
		container.find('.qnxselectdropdown').attr('style', 'left:' + container.find('.qnxselectholder').get(0).offsetLeft + 'px');
		container.find('.qnxselectholder').attr('style', 'width:' + (selectWidth) + 'px');
		
		container.find('.qnxselectholder').click(function(e) {
			
			
			$('.qnxselectholder').each(function() {
				if($(this).hasClass('active')) {
					$($(this).get(0).parentNode).find('.qnxselectdropdown').addClass('hidden');
					$(this).removeClass('active');
				}
			});
			
			
			
			
			$(document).find('.qnxselectholder').addClass('lowered');
			container.find('.qnxselectholder').removeClass('lowered');
			var options = container.find('.qnxselectdropdown ul li');
			var realoptions = element.find('option');
			realoptions.removeAttr('selected');
			options.removeClass('active');
			var currentSelectedItem = container.find('.qnxselectinner span').html();
			for(i=0;i<options.length;i++) {
				if($(options[i]).html() == currentSelectedItem) {
					$(options[i]).addClass('active');
					$(realoptions[i]).get(0).setAttribute('selected', '');
				}
			}
			
			container.find('.qnxselectdropdown').toggleClass('hidden');
			container.find('.qnxselectholder').toggleClass('active');
		});
		container.find('.qnxselectdropdown').click(function(e) {
		container.find('.qnxselectinner span').html($(e.target).html());
		container.find('.qnxselectholder').click();
		$(document).find('.qnxselectholder').removeClass('lowered');
		});
		break;	
		
	}
};


$(document).ready(function() {	
	var qnxelements = $('.qnx');

	qnxelements.qnxwidget();
	
	qnxelements.each(function() {
		if(($(this).get(0).nodeName == 'SELECT')) {
			qnxwidget('select', $(this), {});
		}
	});
	
	$(document).click(function(e) {
		var closethem = true;
		if($(e.target).hasClass('qnxselectedtext')) {
			closethem = false;
		}
		if($(e.target).hasClass('qnxselectright')) {
			closethem = false;
		}
		if($(e.target).hasClass('qnxselectinner')) {
			closethem = false
		}
		if($(e.target).hasClass('qnxselectholder')) {
			closethem = false
		}		
		if(closethem) {
			$('.qnxselectholder').each(function() {
				if($(this).hasClass('active')) {
					$($(this).get(0).parentNode).find('.qnxselectdropdown').addClass('hidden');
					$(this).removeClass('active');				}
			});
		}
	});
	
});