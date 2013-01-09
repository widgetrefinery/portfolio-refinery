require([
	'jquery',
	'page/account',
	'page/accountEdit',
	'page/accountList',
	'page/accountNew',
	'page/investmentEdit',
	'page/investmentList',
	'page/investmentNew',
	'page/transaction',
	'util/uri',
	'jquery.mockjax'
], function ($, Account, AccountEdit, AccountList, AccountNew, InvestmentEdit, InvestmentList, InvestmentNew, Transaction, URI) {

	module('page');

	asyncTest('all', function () {
		var restApi = {
			'/account':      {
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
			'/account/1':    {
				url: {
					self:     '/account/1',
					addEntry: '/account/1/entry/create'
				}
			},
			'/investment':   {
				url:         {
					self:          '/investment',
					addInvestment: '/investment/create'
				},
				investments: [
					{url: {self: '/investment/1'}, name: 'Investment 1', active: false},
					{url: {self: '/investment/2'}, name: 'Investment 2', active: true},
					{url: {self: '/investment/3'}, name: 'Investment 3', active: true}
				]
			},
			'/investment/1': {
				url:    {
					self: '/investment/1'
				},
				name:   'investment 1',
				symbol: 'ticker symbol',
				type:   'BOND',
				active: true
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
			{clazz: AccountList, href: '#account'},
			{clazz: AccountNew, href: '#account/create'},
			{clazz: InvestmentEdit, href: '#investment/1'},
			{clazz: InvestmentList, href: '#investment'},
			{clazz: InvestmentNew, href: '#investment/create'},
			{clazz: Transaction, href: '#transaction'}
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