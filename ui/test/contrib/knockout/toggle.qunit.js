define([
	'jquery',
	'knockout',
	'contrib/knockout/toggle'
], function ($, ko) {

	module('contrib/knockout');

	test('toggle', function () {
		var $root = $('<div data-bind="toggle:state">').hide().appendTo($('body'));
		var model = {state: ko.observable(false)};
		ko.applyBindings(model, $root[0]);
		$root.trigger('click');
		equal(model.state(), true, 'state toggled to true');
		$root.trigger('click');
		equal(model.state(), false, 'state toggled to false');
		$root.trigger('click');
		equal(model.state(), true, 'state toggled back to true');
		model.state(false);
		$root.trigger('click');
		equal(model.state(), true, 'state toggled to true');
		$root.remove();
	});

});
