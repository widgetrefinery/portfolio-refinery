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
		var model = {data: ['value 1', 'value 2', 'value 3'], search: function (data, func) {
			searchData = data;
			func(this.data);
		}};
		ko.applyBindings(model, $root[0]);
		//test binding
		$root.val('va').trigger('keyup');
		equal(searchData, 'va', 'typeahead was invoked');
		equal($root.data('typeahead').$menu.find('li').text(), 'value 1value 2value 3', 'search results displayed');
		$root.data('typeahead').$menu.remove();
		//cleanup
		$root.remove();
	});

});