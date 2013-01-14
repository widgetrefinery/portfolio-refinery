require([
	'jquery',
	'model/transactionSearch',
	'util/config',
	'jquery.mockjax'
], function ($, TransactionSearch, config) {

	var ajaxTimeout = 50;

	module('model/transactionSearch');

	test('types', function () {
		var model = new TransactionSearch({existing: true, parentDepth: -1});
		deepEqual(model.types[1], {id: 'D', desc: 'Dividend'}, 'transaction type 1');
		deepEqual(model.types[2], {id: 'B', desc: 'Purchase'}, 'transaction type 2');
		deepEqual(model.types[5], {id: 'T', desc: 'Transfer'}, 'transaction type 5');
	});

	test('reset', function () {
		var model = new TransactionSearch({existing: true, parentDepth: -1});
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

	test('setData', function () {
		var model = new TransactionSearch({existing: true, parentDepth: -1});
		model.setData({
			url:          {next: '/transaction/next'},
			transactions: [
				{
					url:        {self: '/transaction/1'},
					account:    {name: 'Account 1'},
					investment: {name: 'Inv 1', symbol: 'SYM1'},
					unitPrice:  1,
					quantity:   2,
					total:      3,
					principle:  4,
					type:       'B'
				},
				{
					url:        {self: '/transaction/2'},
					account:    {name: 'Account 2'},
					investment: {name: 'Inv 2', symbol: 'SYM2'},
					unitPrice:  1.23456,
					quantity:   2.34567,
					total:      3.45678,
					principle:  4.56789,
					type:       'S'
				}
			]
		});
		equal(model.moreResults.url(), '/transaction/next', 'next url');
		equal(model.moreResults.enable(), true, 'next url enabled');
		equal(model.results().length, 2, '2 transactions loaded');
		equal(model.results()[0].fmtUnitPrice, '$1.00', '1st fmtUnitPrice');
		equal(model.results()[0].fmtQuantity, '2.0000', '1st fmtQuantity');
		equal(model.results()[0].fmtTotal, '$3.00', '1st fmtTotal');
		equal(model.results()[0].fmtPrinciple, '$4.00', '1st fmtPrinciple');
		equal(model.results()[0].typeName, 'Purchase', '1st typeName');
		equal(model.results()[1].fmtUnitPrice, '$1.23', '2nd fmtUnitPrice');
		equal(model.results()[1].fmtQuantity, '2.3457', '2nd fmtQuantity');
		equal(model.results()[1].fmtTotal, '$3.46', '2nd fmtTotal');
		equal(model.results()[1].fmtPrinciple, '$4.57', '2nd fmtPrinciple');
		equal(model.results()[1].typeName, 'Sell', '2nd typeName');
		model.setData({
			url:          {},
			transactions: []
		});
		equal(model.moreResults.url(), undefined, 'next url blanked');
		equal(model.moreResults.enable(), false, 'next url disabled');
		equal(model.results().length, 2, 'transaction list unmodified');
	});

	asyncTest('search', function () {
		var transaction = {
			account:    {name: 'Account 1'},
			investment: {name: 'Inv 1', symbol: 'SYM1'},
			unitPrice:  1,
			quantity:   2,
			total:      3,
			principle:  4,
			type:       'B'
		};

		$.mockjax({
			url:          config.url.transactionList,
			type:         'GET',
			responseTime: 0,
			contentType:  'application/json',
			responseText: JSON.stringify({
				url:          {next: '/transaction/next'},
				transactions: [
					$.extend({url: {self: '/transaction/1'}}, transaction),
					$.extend({url: {self: '/transaction/2'}}, transaction),
					$.extend({url: {self: '/transaction/3'}}, transaction)
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
						$.extend({url: {self: '/transaction/4'}}, transaction),
						$.extend({url: {self: '/transaction/5'}}, transaction)
					]
				});
			}
		});

		var model = new TransactionSearch({existing: true, parentDepth: -1});
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
		var transaction = {
			account:    {name: 'Account 1'},
			investment: {name: 'Inv 1', symbol: 'SYM1'},
			unitPrice:  1,
			quantity:   2,
			total:      3,
			principle:  4,
			type:       'B'
		};

		$.mockjax({
			url:          config.url.transactionList,
			type:         'GET',
			responseTime: 0,
			contentType:  'application/json',
			responseText: JSON.stringify({
				url:          {next: '/transaction/next'},
				transactions: [
					$.extend({url: {self: '/transaction/1'}}, transaction),
					$.extend({url: {self: '/transaction/2'}}, transaction),
					$.extend({url: {self: '/transaction/3'}}, transaction)
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
					$.extend({url: {self: '/transaction/4'}}, transaction),
					$.extend({url: {self: '/transaction/5'}}, transaction)
				]
			})
		});

		$.mockjax({
			url:          '/transaction/more-results',
			type:         'GET',
			responseTime: 0,
			status:       400
		});

		var model = new TransactionSearch({existing: true, parentDepth: -1});
		model.search();
		setTimeout(part1, ajaxTimeout);

		function part1() {
			equal(model.moreResults.url(), '/transaction/next', 'more results link remembered');
			equal(model.results().length, 3, '3 results found');
			equal(model.moreResults.error(), false, 'error is not set');
			model.moreResults.error(true);
			model.next();
			setTimeout(part2, ajaxTimeout);
		}

		function part2() {
			equal(model.moreResults.url(), '/transaction/more-results', 'more results link remembered');
			equal(model.results().length, 5, '5 results total');
			equal(model.moreResults.error(), false, 'error is not set');
			model.next();
			setTimeout(part3, ajaxTimeout);
		}

		function part3() {
			equal(model.moreResults.url(), '/transaction/more-results', 'no change to more results link');
			equal(model.results().length, 5, 'still 5 results total');
			equal(model.moreResults.error(), true, 'error is set');
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
		var model = new TransactionSearch({existing: true, parentDepth: -1});
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
		var model = new TransactionSearch({existing: true, parentDepth: -1});
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