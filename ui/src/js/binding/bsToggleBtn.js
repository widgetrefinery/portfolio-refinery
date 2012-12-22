define(['jquery', 'knockout', 'bootstrap'], function ($, ko) {
	ko.bindingHandlers.bsToggleBtn = {
		init:   function (elem, value) {
			var $elem = $(elem);
			$elem.button('toggle');
			if (value()() != $elem.hasClass('active')) {
				$elem.button('toggle');
			}
			$elem.click(function (e) {
				e.preventDefault();
				$elem.button('toggle');
				var newValue = $elem.hasClass('active');
				if (value().peek() != newValue) {
					value()(newValue);
				}
			});
		},
		update: function (elem, value) {
			var $elem = $(elem);
			if (value()() != $elem.hasClass('active')) {
				$elem.button('toggle');
			}
		}
	};
});