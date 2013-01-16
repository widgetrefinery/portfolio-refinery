define([
	'jquery',
	'knockout',
	'contrib/knockout/infiniteScroll',
	'i18n!nls/i18n',
	'model/list',
	'util/app',
	'util/common',
	'util/config',
	'util/uri'
], function ($, ko, infiniteScroll, i18n, List, app, common, config, URI) {

	var transactionTypes = $.map(i18n.common.transactionType, function (value, key) {
		return {id: key, desc: value};
	});
	transactionTypes.sort(function (a, b) {
		return a.desc.localeCompare(b.desc);
	});
	transactionTypes.unshift({id: '', desc: i18n.transactionMenu.type});

	return common.bless(app.BaseModel, 'model.TransactionSearch', {
		constructor:    function (args) {
			this._super(args);
			this.addUri = new URI(config.url.transactionAdd);
			this.types = transactionTypes;
			this.searchParams = {
				startDate:  ko.observable(),
				endDate:    ko.observable(),
				account:    ko.observable(),
				investment: ko.observable(),
				type:       ko.observable()
			};
			this.moreResults = new URI();
			this.moreResults.state = ko.observable(infiniteScroll.DISABLED);
			this.results = ko.observableArray();
		},
		reset:          function () {
			var self = this;
			$.each(this.searchParams, function (key) {
				self.searchParams[key]('');
			});
		},
		search:         function () {
			var params = {};
			var hasParams = false;
			$.each(this.searchParams, function (key, param) {
				var value = param();
				if (undefined !== value && null !== value && '' !== value) {
					params[key] = value;
					hasParams = true;
				}
			});
			var url = config.url.transactionList;
			if (hasParams) {
				url = url + '?' + $.param(params);
			}
			this.uri.url(url);
			this.results([]);
			this.refresh();
		},
		next:           function () {
			this.uri.url(this.moreResults.url());
			this.refresh();
		},
		refresh:        function () {
			this.moreResults.state(infiniteScroll.BUSY);
			this._super();
		},
		_refreshError:  function (xhr) {
			this._super(xhr);
			this.moreResults.state(infiniteScroll.ERROR);
		},
		setData:        function (data) {
			var self = this;
			if (data.url) {
				this.moreResults.url(data.url.next);
			} else {
				this.moreResults.url('');
			}
			$.each(data.transactions, function (ndx, transaction) {
				transaction.uri = new URI(transaction.url.self);
				transaction.fmtUnitPrice = common.currency(transaction.unitPrice);
				transaction.fmtQuantity = transaction.quantity.toFixed(4);
				transaction.fmtTotal = common.currency(transaction.total);
				transaction.fmtPrinciple = common.currency(transaction.principle);
				transaction.typeName = i18n.common.transactionType[transaction.type];
				self.results.push(transaction);
			});
			this.moreResults.state(this.moreResults.url() ? infiniteScroll.READY : infiniteScroll.DISABLED);
		},
		findAccount:    function (searchParam, callback) {
			this._typeahead(config.url.accountList, searchParam, 'accounts', callback);
		},
		findInvestment: function (searchParam, callback) {
			this._typeahead(config.url.investmentList, searchParam, 'investments', callback);
		},
		_typeahead:     function (searchUrl, searchParam, resultKey, callback) {
			$.ajax(searchUrl, {
				data:    $.param({name: searchParam}),
				success: function (data) {
					data = data[resultKey];
					data = $.map(data, function (entry) {
						return entry.name
					});
					callback(data);
				}
			});
		}
	});

});