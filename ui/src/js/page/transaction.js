define([
	'jquery',
	'model/transactionSearch',
	'page/2column',
	'util/app',
	'util/common',
	'util/uri',
	'text!view/transactionMenu.html',
	'text!view/transactionSearch.html'
], function ($, TransactionSearch, Parent, app, common, URI, transactionMenuHtml, transactionSearchHtml) {

	return common.bless(Parent, 'page.Transaction', {
		setLeft:   function (prevPage, $container) {
			var transactionSearch = this._addModel(prevPage, TransactionSearch, {});
			var $transactionMenuHtml = $(transactionMenuHtml).appendTo($container);
			transactionSearch.bind($transactionMenuHtml);
		},
		setCenter: function (prevPage, $container) {
			var transactionSearch = this._addModel(prevPage, TransactionSearch, {});
			var $transactionSearchHtml = $(transactionSearchHtml).appendTo($container);
			transactionSearch.bind($transactionSearchHtml);
		}
	});

});