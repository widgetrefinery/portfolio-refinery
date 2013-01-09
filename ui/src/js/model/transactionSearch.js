define([
	'jquery',
	'knockout',
	'i18n!nls/i18n',
	'model/list',
	'util/app',
	'util/common',
	'util/config',
	'util/uri'
], function ($, ko, i18n, List, app, common, config, URI) {

	var transactionTypes = $.map(i18n.common.transactionType, function (value, key) {
		return {id: key, desc: value};
	});
	transactionTypes.sort(function (a, b) {
		return a.desc.localeCompare(b.desc);
	});
	transactionTypes.unshift({id: '', desc: i18n.transactionMenu.param.type});

	return common.bless(app.BaseModel, 'model.TransactionSearch', {
		constructor: function (args) {
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
			this.results = ko.observableArray();
			var self = this;
			this.findAccount = function (searchParam, callback) {
				self._typeahead(config.url.accountList, searchParam, 'accounts', callback);
			};
			this.findInvestment = function (searchParam, callback) {
				self._typeahead(config.url.investmentList, searchParam, 'investments', callback);
			};
		},
		reset:       function () {
			var self = this;
			$.each(this.searchParams, function (key) {
				self.searchParams[key]('');
			});
		},
		search:      function () {
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
			this.results([]);
			this._loadData(url);
		},
		next:        function () {
			this._loadData(this.moreResults.url());
		},
		_loadData:   function (url) {
			if (url) {
				this._setBusy(true);
				$.ajax(url, {
					context:  this,
					complete: this._ajaxComplete,
					error:    this._ajaxError,
					success:  this.setData
				});
			}
		},
		setData:     function (data) {
			var self = this;
			if (data.url) {
				this.moreResults.url(data.url.next);
			} else {
				this.moreResults.url('');
			}
			$.each(data.transactions, function (ndx, transaction) {
				self.results().push(transaction);
			});
		},
		_typeahead:  function (searchUrl, searchParam, resultKey, callback) {
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