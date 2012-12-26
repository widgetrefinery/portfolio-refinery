define([
	'jquery',
	'knockout',
	'binding/bsCollapse'
], function ($, ko) {

	module('binding/bsCollapse');

	test('binding', function () {
		//disable animated transitions; these only work when the bootstrap css is installed
		var transitionBak = $.support.transition;
		$.support.transition = undefined;
		//create widget with initial collapsed state
		var $body = $('body');
		var root = '<div data-bind="bsCollapse:state">collapsible content</div>';
		var $root = $(root).appendTo($body);
		var events = [];
		$.each(['show', 'shown', 'hide', 'hidden'], function (ndx, event) {
			$root.on(event, function () {
				events.push(event);
			});
		});
		var model = {state: ko.observable(false)};
		ko.applyBindings(model, $root[0]);
		equal($root.hasClass('in'), false, 'dom is initially collapsed');
		deepEqual(events, [], 'no events fired');
		//toggle state
		model.state(true);
		equal($root.hasClass('in'), true, 'dom is expanded');
		deepEqual(events, ['show', 'shown'], 'expand events fired');
		events = [];
		model.state(false);
		equal($root.hasClass('in'), false, 'dom is collapsed again');
		deepEqual(events, ['hide', 'hidden'], 'collapse events fired');
		events = [];
		model.state(true);
		equal($root.hasClass('in'), true, 'dom is expanded again');
		deepEqual(events, ['show', 'shown'], 'expand events fired');
		//create widget with initial expanded state
		$root.off().remove();
		$root = $(root).appendTo($body);
		events = [];
		$.each(['show', 'shown', 'hide', 'hidden'], function (ndx, event) {
			$root.on(event, function () {
				events.push(event);
			});
		});
		model.state(true);
		ko.applyBindings(model, $root[0]);
		equal($root.hasClass('in'), true, 'dom is initially expanded');
		deepEqual(events, [], 'no events fired');
		//toggle state
		model.state(false);
		equal($root.hasClass('in'), false, 'dom is collapsed');
		deepEqual(events, ['hide', 'hidden'], 'collapse events fired');
		events = [];
		model.state(true);
		equal($root.hasClass('in'), true, 'dom is expanded again');
		deepEqual(events, ['show', 'shown'], 'expand events fired');
		events = [];
		model.state(false);
		equal($root.hasClass('in'), false, 'dom is collapsed again');
		deepEqual(events, ['hide', 'hidden'], 'collapse events fired');
		//cleanup
		$root.remove();
		$.support.transition = transitionBak;
	});

});