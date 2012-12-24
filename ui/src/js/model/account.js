define([
	'jquery',
	'knockout',
	'util/app',
	'text!view/account.html'
], function ($, ko, app, view) {
	var Account = app.bless(app.BaseModel, {
		constructor: function (resource) {
			this.supr(resource);
			this.editResource = app.resource();
			this.addEntryResource = app.resource();
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
			this.resource.url(data.url.self);
			this.editResource.url(data.url.self + '/edit');
			this.addEntryResource.url(data.url.addEntry);
			this.name(data.name);
			this.active(data.active);
		}
	});

	return {
		Model: Account,
		name:  'account',
		view:  view
	};
});