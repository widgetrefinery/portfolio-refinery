define([
	'knockout'
], function (ko) {

	var current = ko.observable('');

	var subUri = function (uri, depth) {
		var parts = uri.substr(1).split('/');
		if (0 <= depth) {
			if (parts.length < depth) {
				throw 'uri is too shallow: ' + uri + ', ' + depth;
			}
			return uri[0] + parts.slice(0, depth).join('/');
		} else {
			if (parts.length < -depth) {
				throw 'uri is too shallow: ' + uri + ', ' + depth;
			}
			return uri[0] + parts.slice(0, parts.length + depth).join('/');
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
	URI.subUri = subUri;
	return URI;

});