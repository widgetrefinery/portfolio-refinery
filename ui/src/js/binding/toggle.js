define([
	'jquery',
	'knockout'
], function ($, ko) {
	ko.bindingHandlers.toggle = {
		init: function (elem, value) {
			$(elem).click(function (e) {
				e.preventDefault();
				value()(!value()());
			});
		}
	}
});