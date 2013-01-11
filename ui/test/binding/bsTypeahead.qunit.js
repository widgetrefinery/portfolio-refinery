require([
	'jquery',
	'knockout',
	'binding/bsTypeahead'
], function ($, ko) {

	module('binding/bsTypeahead');

	test('binding', function () {
		//setup
		var searchData = undefined;
		var $root = $('<input data-bind="bsTypeahead:search"/>');
		$root.hide().appendTo($('body'));
		var model = {search: function (data, func) {
			searchData = data;
			func(['value 1', 'value 2', 'value 3']);
		}};
		ko.applyBindings(model, $root[0]);
		//test binding
		$root.val('va').trigger('keyup');
		equal(searchData, 'va', 'typeahead was invoked');
		$root.data('typeahead').$menu.remove();
		//cleanup
		$root.remove();
	});

});