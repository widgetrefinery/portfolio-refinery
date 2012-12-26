define([
	'jquery',
	'knockout',
	'util/app',
	'util/common',
	'util/uri'
], function ($, ko, app, common, URI) {

	return common.bless(app.BaseModel, 'model.Account', {
		constructor: function (uri, existing) {
			this._super(uri, existing);
			var self = this;
			this.editHref = ko.computed(function () {
				var href = self.uri.href();
				return href ? href + '/edit' : undefined;
			});
			this.addEntryUri = new URI();
			this.name = ko.observable();
			this.active = ko.observable();
		},
		getData:     function () {
			return {
				name:   this.name(),
				active: this.active()
			};
		},
		setData:     function (data) {
			if (data.url) {
				this.uri.url(data.url.self);
				this.addEntryUri.url(data.url.addEntry);
			} else {
				this.uri.url(undefined);
				this.addEntryUri.url(undefined);
			}
			this.name(data.name);
			this.active(data.active);
		}
	});

});