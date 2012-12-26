define([
	'knockout'
], function (ko) {

	var current = ko.observable('');

	var goUp = function () {
		var href = current();
		if (href) {
			var ndx = href.lastIndexOf('/');
			if (-1 != ndx) {
				href = href.substring(0, ndx);
			} else {
				href = '#';
			}
			current(href);
		}
	};

	var URI = function (uri) {
		if (uri && '#' == uri.substr(0, 1)) {
			uri = '/' + uri.substr(1);
		}
		var self = this;
		this.url = ko.observable(uri);
		this.href = ko.computed({
			read:  function () {
				var result = self.url();
				return result ? '#' + result.substr(1) : undefined;
			},
			write: function (value) {
				self.url(value ? '/' + value.substr(1) : undefined);
			}
		});
		this.active = ko.computed(function () {
			var cur = current();
			var href = self.href();
			if (cur && href) {
				if (cur.length == href.length) {
					return cur == href;
				} else if (cur.length > href.length) {
					return cur.substr(0, href.length + 1) == href + '/';
				}
			}
			return false;
		});
	};

	URI.current = current;
	URI.goUp = goUp;
	return URI;

});