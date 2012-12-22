define(['jquery', 'knockout', 'binding/bsToggleBtn'], function ($, ko) {
	module('binding/bsToggleBtn');

	test('binding', function () {
		var $root = $('<div><button data-bind="bsToggleBtn:state">Toggle Button</button></div>');
		$root.hide().appendTo($('body'));
		var model = {state: ko.observable(false)};
		ko.applyBindings(model, $root[0]);
		equal($root.find('.active').length, 0, 'button is deselected');
		//update via observable
		model.state(true);
		equal($root.find('.active').length, 1, 'button is selected via observable');
		model.state(true);
		equal($root.find('.active').length, 1, 'button is still selected');
		model.state(false);
		equal($root.find('.active').length, 0, 'button is deselected via observable');
		model.state(false);
		equal($root.find('.active').length, 0, 'button is still deselected');
		//update via dom
		$root.find('button').trigger('click');
		equal($root.find('.active').length, 1, 'button is selected via dom');
		equal(model.state(), true, 'observable is set');
		$root.find('button').trigger('click');
		equal($root.find('.active').length, 0, 'button is deselected via dom');
		equal(model.state(), false, 'observable is reset');
		$root.remove();
	});
});