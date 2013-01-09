define([
	'jquery',
	'knockout',
	'model/list',
	'util/app',
	'util/common',
	'util/config',
	'util/uri'
], function ($, ko, List, app, common, config, URI) {

	return common.bless(app.BaseModel, 'model.TransactionSearch', {
		constructor:    function (args) {
			this._super(args);
			this.searchParams = {
				startDate:  ko.observable(),
				endDate:    ko.observable(),
				account:    ko.observable(),
				investment: ko.observable(),
				type:       ko.observable()
			};
			this.moreResults = new URI();
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
			this.results([]);
			this._loadData(url);
		},
		next:           function () {
			this._loadData(this.moreResults.url());
		},
		_loadData:      function (url) {
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
		setData:        function (data) {
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
		findAccount:    function (account, callback) {
			$.ajax(config.url.accountList, {
				context: this,
				data:    $.param({name: account}),
				success: function (data) {
					this._runCallback(data.accounts, callback);
				}
			});
		},
		findInvestment: function (investment, callback) {
			$.ajax(config.url.investmentList, {
				context: this,
				data:    $.param({name: investment}),
				success: function (data) {
					this._runCallback(data.investments, callback);
				}
			});
		},
		_runCallback:   function (data, callback) {
			data = $.map(data, function (entry) {
				return entry.name
			});
			callback(data);
		}
	});

});