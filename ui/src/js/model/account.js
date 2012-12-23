define(['knockout', 'util/app', 'text!view/account.html'], function (ko, app, html) {
	var Account = app.bless(app.BaseModel, {
		constructor: function (resource) {
			this.supr(resource);
			this.name = ko.observable();
			this.active = ko.observable();
		},
		setData:     function (data) {
			this.resource.url(data.url.self);
			this.name(data.name);
			this.active(data.active);
		}
	});

	return {
		Model: Account,
		view:  html
	};
});