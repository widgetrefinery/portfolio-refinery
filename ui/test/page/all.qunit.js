require([
	'jquery',
	'page/account',
	'page/accountEdit',
	'page/accountList',
	'util/uri',
	'jquery.mockjax'
], function ($, Account, AccountEdit, AccountList, URI) {

	module('page');

	asyncTest('all', function () {
		var restApi = {
			'/account':   {
				url:      {
					self:       '/account',
					addAccount: '/account/create'
				},
				accounts: [
					{url: {self: '/account/1'}, name: 'Account 1', active: false},
					{url: {self: '/account/2'}, name: 'Account 2', active: true},
					{url: {self: '/account/3'}, name: 'Account 3', active: true}
				]
			},
			'/account/1': {
				url: {
					self:     '/account/1',
					addEntry: '/account/1/entry/create'
				}
			}
		};
		$.each(restApi, function (url, response) {
			$.mockjax({
				url:          url,
				type:         'GET',
				responseTime: 0,
				contentType:  'application/json',
				responseText: JSON.stringify(response)
			});
		});
		var ajaxTimeout = 50;

		var pages = [
			{clazz: Account, href: '#account/1'},
			{clazz: AccountEdit, href: '#account/1'},
			{clazz: AccountList, href: '#account'}
		];
		var page;
		part1();

		function part1() {
			URI.current(pages[0].href);
			page = new pages[0].clazz();
			setTimeout(part2, ajaxTimeout);
		}

		function part2() {
			equal(true, true, pages[0].clazz._name);
			page = new pages[0].clazz(page);
			setTimeout(part3, ajaxTimeout);
		}

		function part3() {
			equal(true, true, pages[0].clazz._name + ' with previous page');
			pages.shift();
			if (pages.length) {
				part1();
			} else {
				$.mockjaxClear();
				start();
			}
		}
	});

});