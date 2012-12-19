define(['jquery', 'knockout', 'model/accounts', 'text!page/2panel.html'], function ($, ko, accounts, html) {
	return function () {
		$('#content').empty().append(html);

		this.accounts = {
			model: new accounts.model('/' + location.hash.substr(1)),
			view:  $(accounts.view)
		};
		$('#left').append(this.accounts.view);
		ko.applyBindings(this.accounts.model, this.accounts.view[0]);
		this.accounts.model.refresh();
	};
});