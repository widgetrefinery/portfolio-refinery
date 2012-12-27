define([
	'knockout',
	'knockout.mapping',
	'util/app',
	'util/common',
	'util/uri'
], function (ko, kom, app, common, URI) {

	return common.bless(app.BaseModel, 'model.Accounts', {
		constructor:    function (args) {
			this._super(args);
			this.addAccountUri = new URI();
			this.accounts = kom.fromJS([]);
			this.show = {
				activeAccounts:   ko.observable(true),
				inactiveAccounts: ko.observable(false)
			};
		},
		setData:        function (data) {
			this.addAccountUri.url(data.url.addAccount);
			if (data.accounts) {
				this._parseAccounts(data.accounts);
			} else {
				this.accounts.removeAll();
			}
		},
		_parseAccounts: function (accounts) {
			accounts.sort(function (a, b) {
				return a.name.localeCompare(b.name);
			});
			kom.fromJS(accounts, {
				'': {
					key:    function (account) {
						return ko.utils.unwrapObservable(account.url.self);
					},
					create: function (options) {
						var account = kom.fromJS(options.data);
						account.uri = new URI(options.data.url.self);
						return account;
					}
				}
			}, this.accounts);
		}
	});

});