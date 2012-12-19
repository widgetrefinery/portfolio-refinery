define(['jquery', 'knockout', 'model/account', 'util/api', 'text!view/accounts.html'], function ($, ko, account, api, html) {
	var Accounts = function () {
		this.busy = ko.observable(false);
		this.error = ko.observable();
		this.accounts = ko.observableArray([]);
	};
	Accounts.prototype.set = function (data) {
		var self = this;
		this.accounts.removeAll();
		$.each(data, function () {
			var anAccount = new account.model();
			anAccount.set(this);
			self.accounts.push(anAccount);
		});
		this.accounts.sort(function (a, b) {
			return a.name == b.name ? 0 : (a.name < b.name ? 1 : -1);
		});
	};
	Accounts.prototype.refresh = function () {
		var self = this;
		this.busy(true);
		$.ajax(api.url.accountList, {
			complete: function () {
				self.busy(false);
			},
			error:    function (xhr, status) {
				self.error(status);
			},
			success:  function (data) {
				self.set(data);
			}
		});
	};

	return {
		model: Accounts,
		view:  html
	};
});