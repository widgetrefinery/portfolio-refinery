require([
	'jquery',
	'knockout',
	'model/accounts'
], function ($, ko, Accounts) {

	module('model/accounts');

	test('setData', function () {
		var model = new Accounts({uri: '/dummy/url', existing: true, parentDepth: -1});
		model.setData({
			url:      {
				self:       '/account',
				addAccount: '/account/create'
			},
			accounts: [
				{url: {self: '/account/1'}, name: 'Account 1', active: false},
				{url: {self: '/account/3'}, name: 'Account 3', active: true},
				{url: {self: '/account/2'}, name: 'Account 2', active: true}
			]
		});
		equal(model.addAccountUri.url(), '/account/create', 'checking addAccount url');
		equal(model.accounts().length, 3, 'all accounts loaded');
		equal(model.accounts()[0].uri.url(), '/account/1', 'accounts are sorted');
		equal(model.accounts()[1].uri.url(), '/account/2', 'accounts are sorted');
		equal(model.accounts()[2].uri.url(), '/account/3', 'accounts are sorted');
		model.setData({});
		equal(model.addAccountUri.url(), undefined, 'checking addAccount url');
		equal(model.accounts().length, 0, 'account list cleared');
	});

});