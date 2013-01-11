require([
	'jquery',
	'knockout',
	'binding/juDatepicker'
], function ($, ko) {

	module('binding/juDatepicker');

	test('binding', function () {
		//setup
		var $root = $('<input data-bind="juDatepicker:{value:state}"/>');
		$root.hide().appendTo($('body'));
		var model = {state: ko.observable()};
		ko.applyBindings(model, $root[0]);
		//test datepicker
		equal($root.datepicker('getDate'), null, 'datepicker is initialized');
		model.state('2001-02-03');
		equal($root.val(), '2001-02-03', 'dom updated via model');
		deepEqual($root.datepicker('getDate'), new Date(2001, 1, 3, 0, 0, 0, 0), 'datepicker updated via model');
		$root.val('2002-03-04').trigger('change');
		equal(model.state(), '2002-03-04', 'model updated via dom');
		deepEqual($root.datepicker('getDate'), new Date(2002, 2, 4, 0, 0, 0, 0), 'datepicker updated via dom');
		//cleanup
		$root.datepicker('widget').remove();
		$root.remove();
	});

	test('before', function () {
		//setup
		var $root = $('<div><input data-bind="juDatepicker:{before:\'#to\',value:from}"/><input id="to" data-bind="juDatepicker:{value:to}"/></div>');
		$root.hide().appendTo($('body'));
		var model = {from: ko.observable(), to: ko.observable()};
		ko.applyBindings(model, $root[0]);
		//test from
		equal($root.find('#to').datepicker('option', 'minDate'), undefined, 'minDate is not set');
		model.from('2001-02-03');
		equal($root.find('#to').datepicker('option', 'minDate'), '2001-02-03', 'minDate is set');
		model.from(undefined);
		equal($root.find('#to').datepicker('option', 'minDate'), undefined, 'minDate is reset');
		//cleanup
		$root.datepicker('widget').remove();
		$root.remove();
	});

	test('after', function () {
		//setup
		var $root = $('<div><input id="from" data-bind="juDatepicker:{value:from}"/><input data-bind="juDatepicker:{after:\'#from\',value:to}"/></div>');
		$root.hide().appendTo($('body'));
		var model = {from: ko.observable(), to: ko.observable()};
		ko.applyBindings(model, $root[0]);
		//test from
		equal($root.find('#from').datepicker('option', 'maxDate'), undefined, 'maxDate is not set');
		model.to('2001-02-03');
		equal($root.find('#from').datepicker('option', 'maxDate'), '2001-02-03', 'maxDate is set');
		model.to(undefined);
		equal($root.find('#from').datepicker('option', 'maxDate'), undefined, 'maxDate is reset');
		//cleanup
		$root.datepicker('widget').remove();
		$root.remove();
	});

});