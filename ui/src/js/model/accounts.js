define([
	'jquery',
	'knockout',
	'knockout.mapping',
	'util/api',
	'util/app',
	'text!view/accounts.html'
], function ($, ko, kom, api, app, html) {
	var Accounts = app.bless(app.BaseModel, {
		constructor: function () {
			this.supr(app.resource(api.url.accountList));
			this.accounts = kom.fromJS([]);
			this.showAll = ko.observable(false);
		},
		setData:     function (data) {
			if (data) {
				data.sort(function (a, b) {
					return a.name.localeCompare(b.name);
				});
				var self = this;
				kom.fromJS(data, {
					'': {
						key:    function (data) {
							return ko.utils.unwrapObservable(data.href);
						},
						create: function (options) {
							var account = kom.fromJS(options.data);
							account.resource = app.resource(options.data.href);
							account.show = ko.computed(function () {
								return account.active() || self.showAll();
							});
							return account;
						}
					}
				}, this.accounts);
			} else {
				this.accounts.removeAll();
			}
		}
	});

	return {
		Model: Accounts,
		view:  html
	};
});