requirejs.config({
	paths: {
		'bootstrap':        'lib/bootstrap-2.2.2.min',
		'i18n':             'lib/require/i18n-2.0.1',
		'jquery':           'lib/jquery/jquery-1.8.3.min',
		'jquery.mockjax':   '../../test/lib/jquery.mockjax-1.5.1',
		'jquery.visible':   'contrib/jquery/jquery.visible',
		'jqueryui':         'lib/jquery/jquery-ui-1.9.2',
		'knockout':         'lib/knockout/knockout-2.2.0.min',
		'knockout.mapping': 'lib/knockout/knockout.mapping-2.3.5.min',
		'sammy':            'lib/sammy-0.7.2.min',
		'text':             'lib/require/text-2.0.3'
	},
	shim:  {
		// bootstrap and jqueryui both create a $.button() function which
		// conflicts with each other. I'm specifying jqueryui as a
		// dependency on bootstrap to load bootstrap after jqueryui since
		// I'm using bootstrap's version of $.button().
		'bootstrap':      ['jquery', 'jqueryui'],
		'jquery.mockjax': ['jquery'],
		'jquery.visible': ['jquery'],
		'jqueryui':       ['jquery'],
		'sammy':          ['jquery']
	}
});
require([
	'jquery',
	'router',
	'i18n!nls/i18n',
	'bootstrap',
	'contrib/knockout/bsCollapse',
	'contrib/knockout/bsToggleBtn',
	'contrib/knockout/bsTypeahead',
	'contrib/knockout/infiniteScroll',
	'contrib/knockout/juDatepicker',
	'contrib/knockout/toggle',
	'jquery.mockjax'
], function ($, router, i18n) {
	$.ajaxSetup({
		accepts: 'application/json',
		cache:   false,
		timeout: 4000
	});
	$.mockjax({
		url:          '/account',
		type:         'GET',
		contentType:  'application/json',
		responseText: JSON.stringify({
			url:      {
				self:       '/account',
				addAccount: '/account/_'
			},
			accounts: [
				{url: {self: '/account/1'}, name: 'Account 1', active: false},
				{url: {self: '/account/2'}, name: 'Account 2', active: true},
				{url: {self: '/account/3'}, name: 'Account 3', active: true},
				{url: {self: '/account/4'}, name: 'Account 4', active: false}
			]
		})
	});
	$.mockjax({
		url:          '/account/*',
		type:         'GET',
		contentType:  'application/json',
		responseText: JSON.stringify({
			url:    {
				self: '/account/2'
			},
			name:   'Account 2',
			active: true
		})
	});
	$.mockjax({
		url:     '/account/_',
		type:    'POST',
		headers: {
			Location: '/account/2'
		},
		status:  302
	});
	$.mockjax({
		url:    '/account/*',
		type:   'POST',
		status: 204
	});
	$.mockjax({
		url:    '/account/*',
		type:   'DELETE',
		status: 204
	});
	$.mockjax({
		url:          '/investment',
		type:         'GET',
		contentType:  'application/json',
		responseText: JSON.stringify({
			url:         {
				self:          '/investment',
				addInvestment: '/investment/_'
			},
			investments: [
				{url: {self: '/investment/1'}, name: 'Investment 1', active: false},
				{url: {self: '/investment/2'}, name: 'Investment 2', active: true},
				{url: {self: '/investment/3'}, name: 'Investment 3', active: true},
				{url: {self: '/investment/4'}, name: 'Investment 4', active: false}
			]
		})
	});
	$.mockjax({
		url:          '/investment/*',
		type:         'GET',
		contentType:  'application/json',
		responseText: JSON.stringify({
			url:    {
				self: '/investment/2'
			},
			name:   'Investment 2',
			symbol: 'VFITX',
			type:   'BM',
			active: true
		})
	});
	$.mockjax({
		url:     '/investment/_',
		type:    'POST',
		headers: {
			Location: '/investment/2'
		},
		status:  302
	});
	$.mockjax({
		url:    '/investment/*',
		type:   'POST',
		status: 204
	});
	$.mockjax({
		url:    '/investment/*',
		type:   'DELETE',
		status: 204
	});
	var generateTransactions = function (size) {
		var randomInt = function (scale, padding) {
			var result = '' + Math.floor(Math.random() * scale);
			while (result.length < padding) {
				result = '0' + result;
			}
			return result;
		};
		var randomSymbol = function () {
			var randomSpace = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			var result = '';
			for (var ndx = 0; ndx < 5; ndx++) {
				result += randomSpace[Math.floor(Math.random() * randomSpace.length)];
			}
			return result;
		};
		var transactionTypes = $.map(i18n.common.transactionType, function (value, key) {
			return key;
		});
		var transactions = [];
		for (var ndx = 0; ndx < size; ndx++) {
			var accountId = randomInt(10, 1);
			var investmentId = randomInt(10, 1);
			transactions.push({
				url:        {self: '/transaction/' + randomInt(100, 1)},
				ts:         '20' + randomInt(10, 2) + '-' + randomInt(10, 2) + '-' + randomInt(10, 2),
				account:    {
					url:  {self: '/account/' + accountId},
					name: 'Account ' + accountId
				},
				investment: {
					url:    {self: '/investment/' + investmentId},
					name:   'Investment ' + investmentId,
					symbol: randomSymbol()
				},
				unitPrice:  Math.random() * 100,
				quantity:   Math.random() * 10,
				total:      Math.random() * 100,
				principle:  Math.random() * 100,
				type:       transactionTypes[Math.floor(Math.random() * transactionTypes.length)]
			});
		}
		transactions.sort(function (a, b) {
			return a.ts.localeCompare(b.ts);
		});
		return transactions;
	};
	$.mockjax({
		url:         /^\/transaction(\?.+)?$/,
		type:        'GET',
		contentType: 'application/json',
		response:    function () {
			this.responseText = JSON.stringify({
				url:          {
					next: '/transaction/more'
				},
				transactions: generateTransactions(20)
			});
		}
	});
	$.mockjax({
		url:         '/transaction/more',
		type:        'GET',
		contentType: 'application/json',
		response:    function () {
			this.responseText = JSON.stringify({
				url:          {
					next: '/transaction/even-more'
				},
				transactions: generateTransactions(15)
			})
		}
	});
	$.mockjax({
		url:    '/transaction/even-more',
		type:   'GET',
		status: 400
	});
	router.run();
});
