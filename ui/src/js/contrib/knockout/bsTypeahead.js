define([
	'jquery',
	'knockout',
	'bootstrap'
], function ($, ko) {

	ko.bindingHandlers.bsTypeahead = {
		init: function (elem, value, allBindings, model) {
			$(elem).typeahead({
				source: function () {
					return value().apply(model, arguments);
				}
			});
		}
	};

});