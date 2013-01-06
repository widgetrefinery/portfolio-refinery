define([
	'knockout',
	'util/app',
	'util/common'
], function (ko, app, common) {

	return common.bless(app.BaseModel, 'model.Investment', {
		constructor: function (args) {
			this._super(args);
			this.name = ko.observable();
			this.symbol = ko.observable();
			this.type = ko.observable();
			this.active = ko.observable(true);
		},
		getData:     function () {
			return {
				name:   this.name(),
				symbol: this.symbol(),
				type:   this.type(),
				active: this.active()
			};
		},
		setData:     function (data) {
			this.uri.url(data.url.self);
			this.name(data.name);
			this.symbol(data.symbol);
			this.type(data.type);
			this.active(data.active);
		}
	});

});