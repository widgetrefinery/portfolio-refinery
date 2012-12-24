define([
	'jquery',
	'knockout',
	'bootstrap'
], function ($, ko) {
	ko.bindingHandlers.bsCollapse = {
		init:   function (elem, value) {
			$(elem).collapse({toggle: false});
			$(elem).addClass('collapse');
			if (value()()) {
				$(elem).addClass('in');
			}
		},
		update: function (elem, value) {
			var $elem = $(elem);
			if (value()() != $elem.hasClass('in')) {
				$elem.collapse('toggle');
			}
		}
	}
});