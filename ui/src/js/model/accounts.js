define([
	'knockout',
	'knockout.mapping',
	'util/app',
	'util/config',
	'text!view/accounts.html'
], function (ko, kom, app, config, view) {
	var Accounts = app.bless(app.BaseModel, {
		constructor:    function () {
			this.supr(app.resource(config.url.accountList));
			this.addAccountResource = app.resource(undefined);
			this.accounts = kom.fromJS([]);
			this.showAll = ko.observable(false);
		},
		setData:        function (data) {
			var addAccountUrl = undefined;
			var hasAccounts = false;
			if (data) {
				if (data.url) {
					addAccountUrl = data.url.addAccount;
				}
				if (data.accounts) {
					hasAccounts = true;
					this._parseAccounts(data.accounts);
				}
			}
			this.addAccountResource.url(addAccountUrl);
			if (!hasAccounts) {
				this.accounts.removeAll();
			}
		},
		_parseAccounts: function (accounts) {
			accounts.sort(function (a, b) {
				return a.name.localeCompare(b.name);
			});
			var self = this;
			kom.fromJS(accounts, {
				'': {
					key:    function (account) {
						return ko.utils.unwrapObservable(account.url.self);
					},
					create: function (options) {
						var account = kom.fromJS(options.data);
						account.resource = app.resource(options.data.url.self);
						account.show = ko.computed(function () {
							return account.active() || self.showAll();
						});
						return account;
					}
				}
			}, this.accounts);
		}
	});

	return {
		Model: Accounts,
		name:  'accounts',
		view:  view
	};
});