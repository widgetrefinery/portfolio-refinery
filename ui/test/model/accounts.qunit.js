require([
	'jquery',
	'knockout',
	'model/accounts'
], function ($, ko, Accounts) {

	module('model/accounts');

	test('setData', function () {
		var model = new Accounts('/dummy/url', true);
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

//	asyncTest('dom', function () {
//		setupMockjax();
//		var $root = $('<div>').hide().appendTo($('body'));
//		var model = new accounts.Model();
//		var $view = $(accounts.view).appendTo($root);
//		ko.applyBindings(model, $view[0]);
//		model.refresh();
//		setTimeout(part1, ajaxWaitTimeout);
//
//		function part1() {
//			app.location('');
//			equal($root.find('ul:eq(0) > li:eq(0) a').attr('href'), '#account/create', 'add account href is set');
//			equal($root.find('ul:eq(1) > li').length, 2, 'active accounts rendered');
//			equal($root.find('ul:eq(1) > li:eq(0) a').attr('href'), '#account/2', 'verified 1st active account');
//			equal($root.find('ul:eq(2) > li').length, 1, 'inactive accounts rendered');
//			equal($root.find('ul:eq(2) > li:eq(0) a').attr('href'), '#account/1', 'verified 1st inactive account');
//			equal($root.find('.active').length, 0, 'no selected accounts');
//			$root.find('ul:eq(0) > li:eq(3)').trigger('click');
//			equal(model.showAll(), true, 'showAll enabled via dom');
//			app.location('#account/2');
//			equal($root.find('.active').length, 1, '1 selected accounts');
//			equal($root.find('.active').text(), 'Account 2', 'account 2 is selected');
//			$root.remove();
//			$.mockjaxClear();
//			start();
//		}
//	});

});