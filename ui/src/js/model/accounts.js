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
			this.supr(api.url.accountList);
			this.accounts = kom.fromJS([]);
		},
		setData:     function (data) {
			if (data) {
				data.sort(function (a, b) {
					return a.name.localeCompare(b.name);
				});
				kom.fromJS(data, {
					'': {
						key: function (data) {
							return ko.utils.unwrapObservable(data.href);
						}
					}
				}, this.accounts);
			} else {
				this.accounts.removeAll();
			}
		}
	});

	return {
		model: Accounts,
		view:  html
	};
});