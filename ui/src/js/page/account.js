define(['jquery', 'knockout', 'model/accounts', 'model/account', 'text!page/2panel.html'], function ($, ko, accounts, account, html) {
	return function () {
		$('#content').empty().append(html);

		this.accounts = {
			model: new accounts.model('/' + location.hash.substring(1, location.hash.indexOf('/', 1))),
			view:  $(accounts.view)
		};
		$('#left').append(this.accounts.view);
		ko.applyBindings(this.accounts.model, this.accounts.view[0]);
		this.accounts.model.refresh();

		this.account = {
			model: new account.model('/' + location.hash.substr(1)),
			view:  $(account.view)
		};
		$('#center').append(this.account.view);
		ko.applyBindings(this.account.model, this.account.view[0]);
		this.account.model.refresh();
	};
});