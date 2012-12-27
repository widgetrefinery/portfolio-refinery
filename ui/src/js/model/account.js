define([
	'knockout',
	'util/app',
	'util/common',
	'util/uri'
], function (ko, app, common, URI) {

	return common.bless(app.BaseModel, 'model.Account', {
		constructor: function (args) {
			this._super(args);
			var self = this;
			this.editHref = ko.computed(function () {
				var href = self.uri.href();
				return href ? href + '/edit' : undefined;
			});
			this.addEntryUri = new URI();
			this.name = ko.observable();
			this.active = ko.observable(true);
			this.selectedEntry = ko.observable();
			this.selectedEntryHref = ko.computed(function () {
				var entry = self.selectedEntry();
				return entry ? entry.uri.href() : undefined;
			});
		},
		getData:     function () {
			return {
				name:   this.name(),
				active: this.active()
			};
		},
		setData:     function (data) {
			this.uri.url(data.url.self);
			this.addEntryUri.url(data.url.addEntry);
			this.name(data.name);
			this.active(data.active);
		}
	});

});