define([
	'knockout',
	'util/app',
	'util/common'
], function (ko, app, common) {

	return common.bless(app.BaseModel, 'model.Account', {
		constructor: function (args) {
			this._super(args);
			this.name = ko.observable();
			this.active = ko.observable(true);
		},
		getData:     function () {
			return {
				name:   this.name(),
				active: this.active()
			};
		},
		setData:     function (data) {
			this.uri.url(data.url.self);
			this.name(data.name);
			this.active(data.active);
		}
	});

});