require([
	'jquery',
	'knockout',
	'contrib/knockout/infiniteScroll'
], function ($, ko) {

	module('contrib/knockout');

	test('infiniteScroll', function () {
		//setup
		var $root = $('<div style="position:fixed;top:0;left:0" data-bind="infiniteScroll:{enable:enable,error:error,callback:callback}">X</div>').appendTo($('body'));
		var invoked = 0;
		var model = {
			enable:   ko.observable(false),
			error:    ko.observable(false),
			callback: function () {
				equal(this, model, 'ensure callback is invoked with the correct context');
				invoked++;
			}
		};
		ko.applyBindings(model, $root[0]);
		//test binding
		equal(invoked, 0, 'invoked 0 times after setup');
		equal($root.hasClass('busy'), false, 'dom is not marked as busy');
		equal($root.hasClass('error'), false, 'dom is not marked as error');
		model.enable(true);
		equal(invoked, 1, 'invoked 1 time after enabling');
		equal($root.hasClass('busy'), true, 'dom is marked as busy');
		equal($root.hasClass('error'), false, 'dom is not marked as error');
		model.error(true);
		equal(invoked, 1, 'invoked 1 time after setting error');
		equal($root.hasClass('busy'), false, 'dom is not marked as busy');
		equal($root.hasClass('error'), true, 'dom is marked as error');
		$root.css('top', '101%');
		model.error(false);
		equal(invoked, 1, 'invoked 1 time after clearing error and moving off screen');
		equal($root.hasClass('busy'), false, 'dom is not marked as busy');
		equal($root.hasClass('error'), false, 'dom is not marked as error');
		$root.css('top', '50%');
		$(window).trigger('scroll');
		equal(invoked, 2, 'invoked 2 times after triggering scroll event');
		equal($root.hasClass('busy'), true, 'dom is marked as busy');
		equal($root.hasClass('error'), false, 'dom is not marked as error');
		$(window).trigger('scroll');
		equal(invoked, 2, 'invoked 2 times after triggering scroll event again');
		equal($root.hasClass('busy'), true, 'dom is marked as busy');
		equal($root.hasClass('error'), false, 'dom is not marked as error');
		$root.css('top', '101%');
		model.enable(false);
		model.enable(true);
		equal(invoked, 2, 'invoked 2 times after toggling enable');
		equal($root.hasClass('busy'), false, 'dom is not marked as busy');
		equal($root.hasClass('error'), false, 'dom is not marked as error');
		$root.css('top', '50%');
		$(window).trigger('resize');
		equal(invoked, 3, 'invoked 3 times after triggering resize event');
		equal($root.hasClass('busy'), true, 'dom is marked as busy');
		equal($root.hasClass('error'), false, 'dom is not marked as error');
		$(window).trigger('resize');
		equal(invoked, 3, 'invoked 3 times after triggering resize event again');
		equal($root.hasClass('busy'), true, 'dom is marked as busy');
		equal($root.hasClass('error'), false, 'dom is not marked as error');
		model.enable(false);
		model.enable(true);
		equal(invoked, 4, 'invoked 4 times after toggling enable');
		equal($root.hasClass('busy'), true, 'dom is marked as busy');
		equal($root.hasClass('error'), false, 'dom is not marked as error');
		//cleanup
		$root.remove();
	});

});