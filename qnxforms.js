function qnxwidget(type, element, args) {
	var element = element;
	var container = element.parent();
	var detachedElement;
	function buttonTouchStart(element) {
		$(element.parentNode).addClass('active');
	}
	function buttonTouchEnd(element) {
		$(element.parentNode).removeClass('active');
	}
	detachedElement = element.detach();
	switch(type) {
		case 'button':
		container.html('<div class="qnxwidget qnxbuttonholder"></div>');
		container.find('.qnxbuttonholder').append(element);
		element.bind('mousedown', function(e) {
			$(e.target.parentNode).addClass('active');
		});
		element.bind('mouseup', function(e) {
			$(e.target.parentNode).removeClass('active');
		});
		break;
		case 'textfield':
		container.html(container.html() + '<div class="qnxwidget qnxtextfieldholder"><div class="closecross"></div></div>');
		container.find('.qnxtextfieldholder').append(element);
		element.bind('focus', function(e) {
			$(e.target.parentNode).addClass('focused');
		});
		element.bind('blur', function(e) {
			window.setTimeout(function() {
				$(e.target.parentNode).removeClass('focused');
			},200);
		});
		container.find('.closecross').bind('click', function(e) {
			$(e.target.parentNode).find('input').val('');
		});
		break;
		case 'toggle':
		if(element.attr('checked')) {
			container.html(container.html() + '<div class="qnxwidget qnxtoggle on blue"><div class="slider"></div><div class="onlabel">ON</div><div class="offlabel">OFF</div></div>');
		}
		else {
			container.html(container.html() + '<div class="qnxwidget qnxtoggle"><div class="slider"></div><div class="onlabel">ON</div><div class="offlabel">OFF</div></div>');			
		}
		container.append(detachedElement);
		container.find('input').css('display', 'none');
		container.find('.qnxtoggle').bind('click', function(e) {
			var target = $(e.target);
			if(target.parent().hasClass('on')) {
				target.parent().removeClass('on').addClass('off');
				window.setTimeout(function(){target.parent().removeClass('blue');}, 350);
				element.removeAttr('checked');
			}
			else {
				target.parent().removeClass('off').addClass('on');	
				window.setTimeout(function(){target.parent().addClass('blue');}, 350);		
				element.attr('checked', '');	
			}
		});
		break;
		case 'checkbox':
		container.html(container.html() + '<div class="qnxwidget qnxcheckboxholder"><div class="qnxcheckbox"><div class="check"></div></div></div>');
		if(element.attr('checked')) {
		}
		else {
			container.html(container.html() + '<div class="qnxwidget qnxcheckboxholder"><div class="qnxcheckbox"><div class="check hidden"></div></div></div>');		
		}
		container.append(detachedElement.css('display', 'none'));
		container.find('.qnxcheckboxholder').bind('click', function(e) {
			var target = $(e.target), checkboxElement;
			if(target.hasClass('qnxcheckbox')) {
				checkboxElement = $(e.target.parentNode.parentNode).find('input');	
			}
			else {
				checkboxElement = $(e.target.parentNode.parentNode.parentNode).find('input');
			}
			if(target.hasClass('check') || target.hasClass('qnxcheckbox')) {
				if(checkboxElement.attr('checked')) {
					checkboxElement.removeAttr('checked');
					$(e.target.parentNode).find('.check').addClass('hidden');
				}
				else {
					checkboxElement.attr('checked', '');
					$(e.target.parentNode).find('.check').removeClass('hidden');
				}
			}
			});
		break;		
	}
};


$(document).ready(function() {	
	var qnxelements = ($('.qnx'));
	qnxelements.each(function() {
		if(($(this).attr('type') == 'submit') || ($(this).attr('type') == 'button') || ($(this).get(0).nodeName == 'BUTTON')) {
			console.log('ping');
			qnxwidget('button', $(this), {});
		}
		if($(this).attr('type') == 'text') {
			qnxwidget('textfield', $(this), {});	
		}
		if(($(this).attr('type') == 'checkbox') && $(this).hasClass('toggle')) {
			qnxwidget('toggle', $(this), {});
		}
		if(($(this).attr('type') == 'checkbox') && $(this).hasClass('check')) {
			qnxwidget('checkbox', $(this), {});
		}
	});
});