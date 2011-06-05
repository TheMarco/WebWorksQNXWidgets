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
			var that = $(this);
			$('.qnxselectholder').each(function() {
				if($(this).hasClass('active') && $(this).get(0) != that.get(0)) {
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
	var qnxelements = ($('.qnx'));
	
	qnxelements.each(function() {
		console.log($(this).get(0).nodeName);		
		if(($(this).attr('type') == 'submit') || ($(this).attr('type') == 'button') || ($(this).get(0).nodeName == 'BUTTON')) {
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
		if(($(this).get(0).nodeName == 'SELECT')) {
			qnxwidget('select', $(this), {});
		}
	});
	
	$(document).click(function(e) {
		var closethem = true;
		var element = null;
		if($(e.target).hasClass('qnxselectedtext')) {
			closethem = false;
			element = $($(e.target).get(0).parentNode.parentNode.parentNode);
		}
		if($(e.target).hasClass('qnxselectright')) {
			closethem = false;
			element = $($(e.target).get(0).parentNode.parentNode.parentNode);
		}
		if($(e.target).hasClass('qnxselectinner')) {
			closethem = false;
			element = $($(e.target).get(0).parentNode);
		}
		if($(e.target).hasClass('qnxselectholder')) {
			closethem = false;
			element = $(e.target);
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