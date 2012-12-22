define(['jquery', 'knockout', 'model/accounts', 'util/app', 'text!page/2panel.html'], function ($, ko, accounts, app, html) {
	return function () {
		$('#content').empty().append(html);
		this.accounts = app.createWidget(accounts, undefined, $('#left'));
		this.accounts.model.refresh();
	};
});