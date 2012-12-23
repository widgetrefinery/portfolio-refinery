define(['jquery', 'knockout', 'model/accounts', 'model/account', 'util/app', 'text!page/2panel.html'], function ($, ko, accounts, account, app, html) {
	return function () {
		$('#content').empty().append(html);
		this.accounts = app.createWidget(accounts, undefined, $('#left'));
		this.accounts.model.refresh();
		this.account = app.createWidget(account, app.resource(location.hash), $('#center'));
		this.account.model.refresh();
	};
});