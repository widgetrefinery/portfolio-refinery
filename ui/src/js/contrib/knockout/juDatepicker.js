define([
	'jquery',
	'knockout',
	'jqueryui'
], function ($, ko) {

	ko.bindingHandlers.juDatepicker = {
		init:   function (elem, value) {
			var $elem = $(elem);
			$elem.datepicker({
				changeMonth: true,
				changeYear:  true,
				dateFormat:  'yy-mm-dd'
			});
			var config = value();
			$elem.on('change', function () {
				var newValue = $elem.val();
				config.value(newValue);
				if ('' === newValue || undefined === newValue) {
					newValue = null;
				}
				if (config.after) {
					$(config.after).datepicker('option', 'maxDate', newValue);
				}
				if (config.before) {
					$(config.before).datepicker('option', 'minDate', newValue);
				}
			});
		},
		update: function (elem, value) {
			$(elem).val(value().value()).trigger('change');
		}
	};

});