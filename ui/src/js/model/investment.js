define([
	'jquery',
	'knockout',
	'i18n!nls/i18n',
	'util/app',
	'util/common'
], function ($, ko, i18n, app, common) {

	var investmentTypes = $.map(i18n.common.investmentType, function (value, key) {
		return {id: key, desc: value};
	});
	investmentTypes.sort(function (a, b) {
		return a.desc.localeCompare(b.desc);
	});
	investmentTypes.unshift({id: '', desc: ''});

	return common.bless(app.BaseModel, 'model.Investment', {
		constructor: function (args) {
			this._super(args);
			this.types = investmentTypes;
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