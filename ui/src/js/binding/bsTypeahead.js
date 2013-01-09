define([
	'jquery',
	'knockout',
	'bootstrap'
], function ($, ko) {

	ko.bindingHandlers.bsTypeahead = {
		init: function (elem, value) {
			$(elem).typeahead({
				source: value()
			});
		}
	};

});