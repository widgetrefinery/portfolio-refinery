require([
	'jquery',
	'model/transactionSearch',
	'util/config',
	'jquery.mockjax'
], function ($, TransactionSearch, config) {

	var ajaxTimeout = 50;

	module('model/transactionSearch');

	test('reset', function () {
		var model = new TransactionSearch({});
		model.searchParams.startDate('2001-02-03');
		model.searchParams.endDate('2004-05-06');
		model.searchParams.account('account name');
		model.searchParams.investment('vanguard fund');
		model.searchParams.type(0);
		model.reset();
		equal(model.searchParams.startDate(), '', 'checking startDate');
		equal(model.searchParams.endDate(), '', 'checking endDate');
		equal(model.searchParams.account(), '', 'checking account');
		equal(model.searchParams.investment(), '', 'checking investment');
		equal(model.searchParams.type(), '', 'checking type');
	});

	asyncTest('search', function () {
		$.mockjax({
			url:          config.url.transactionList,
			type:         'GET',
			responseTime: 0,
			contentType:  'application/json',
			responseText: JSON.stringify({
				url:          {next: '/transaction/next'},
				transactions: [
					{url: {self: '/transaction/1'}},
					{url: {self: '/transaction/2'}},
					{url: {self: '/transaction/3'}}
				]
			})
		});

		$.mockjax({
			url:          config.url.transactionList + '?*',
			type:         'GET',
			responseTime: 0,
			contentType:  'application/json',
			response:     function (settings) {
				notEqual(settings.url.indexOf('startDate=2001-02-03'), -1, 'checking startDate param');
				notEqual(settings.url.indexOf('endDate=2004-05-06'), -1, 'checking endDate param');
				notEqual(settings.url.indexOf('account=account+name'), -1, 'checking account param');
				notEqual(settings.url.indexOf('investment=vanguard+fund'), -1, 'checking investment param');
				notEqual(settings.url.indexOf('type=0'), -1, 'checking type param');
				this.responseText = JSON.stringify({
					url:          {next: '/transaction/next-with-params'},
					transactions: [
						{url: {self: '/transaction/4'}},
						{url: {self: '/transaction/5'}}
					]
				});
			}
		});

		var model = new TransactionSearch({});
		model.search();
		setTimeout(part1, ajaxTimeout);

		function part1() {
			equal(model.moreResults.url(), '/transaction/next', 'more results link remembered');
			equal(model.results().length, 3, '3 results found');
			model.searchParams.startDate('2001-02-03');
			model.searchParams.endDate('2004-05-06');
			model.searchParams.account('account name');
			model.searchParams.investment('vanguard fund');
			model.searchParams.type(0);
			model.search();
			setTimeout(part2, ajaxTimeout);
		}

		function part2() {
			equal(model.moreResults.url(), '/transaction/next-with-params', 'more results link remembered');
			equal(model.results().length, 2, '2 results found');
			$.mockjaxClear();
			start();
		}
	});

	asyncTest('next', function () {
		$.mockjax({
			url:          config.url.transactionList,
			type:         'GET',
			responseTime: 0,
			contentType:  'application/json',
			responseText: JSON.stringify({
				url:          {next: '/transaction/next'},
				transactions: [
					{url: {self: '/transaction/1'}},
					{url: {self: '/transaction/2'}},
					{url: {self: '/transaction/3'}}
				]
			})
		});

		$.mockjax({
			url:          '/transaction/next',
			type:         'GET',
			responseTime: 0,
			contentType:  'application/json',
			responseText: JSON.stringify({
				url:          {next: '/transaction/more-results'},
				transactions: [
					{url: {self: '/transaction/4'}},
					{url: {self: '/transaction/5'}}
				]
			})
		});

		var model = new TransactionSearch({});
		model.search();
		setTimeout(part1, ajaxTimeout);

		function part1() {
			equal(model.results().length, 3, '3 results found');
			model.next();
			setTimeout(part2, ajaxTimeout);
		}

		function part2() {
			equal(model.moreResults.url(), '/transaction/more-results', 'more results link remembered');
			equal(model.results().length, 5, '5 results total');
			$.mockjaxClear();
			start();
		}
	});

	asyncTest('findAccount', function () {
		$.mockjax({
			url:          config.url.accountList,
			data:         'name=query',
			type:         'GET',
			responseTime: 0,
			contentType:  'application/json',
			responseText: JSON.stringify({
				accounts: [
					{name: 'account 1'},
					{name: 'account 2'},
					{name: 'account 3'}
				]
			})
		});

		var searchResults = [];
		var model = new TransactionSearch({});
		model.findAccount('query', function (data) {
			searchResults = data;
		});
		setTimeout(part1, ajaxTimeout);

		function part1() {
			equal(searchResults.length, 3, '3 results found');
			equal(searchResults[0], 'account 1', '1st result');
			equal(searchResults[1], 'account 2', '2nd result');
			equal(searchResults[2], 'account 3', '3rd result');
			$.mockjaxClear();
			start();
		}
	});

	asyncTest('findInvestment', function () {
		$.mockjax({
			url:          config.url.investmentList,
			data:         'name=query',
			type:         'GET',
			responseTime: 0,
			contentType:  'application/json',
			responseText: JSON.stringify({
				investments: [
					{name: 'investment 1'},
					{name: 'investment 2'},
					{name: 'investment 3'}
				]
			})
		});

		var searchResults = [];
		var model = new TransactionSearch({});
		model.findInvestment('query', function (data) {
			searchResults = data;
		});
		setTimeout(part1, ajaxTimeout);

		function part1() {
			equal(searchResults.length, 3, '3 results found');
			equal(searchResults[0], 'investment 1', '1st result');
			equal(searchResults[1], 'investment 2', '2nd result');
			equal(searchResults[2], 'investment 3', '3rd result');
			$.mockjaxClear();
			start();
		}
	});

});