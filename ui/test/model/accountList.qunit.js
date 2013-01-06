require([
	'jquery',
	'model/accountList'
], function ($, AccountList) {

	module('model/accountList');

	test('setData', function () {
		var model = new AccountList({uri: '/dummy/url', existing: true, parentDepth: -1});
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
		equal(model.addUri.url(), '/account/create', 'checking addAccount url');
		equal(model.entries().length, 3, 'all accounts loaded');
		equal(model.entries()[0].uri.url(), '/account/1', 'accounts are sorted');
		equal(model.entries()[1].uri.url(), '/account/2', 'accounts are sorted');
		equal(model.entries()[2].uri.url(), '/account/3', 'accounts are sorted');
		model.setData({
			url: {
				self:       '/account',
				addAccount: '/account/new'
			}
		});
		equal(model.addUri.url(), '/account/new', 'checking addAccount url');
		equal(model.entries().length, 0, 'all accounts cleared');
	});

});