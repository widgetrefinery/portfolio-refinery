define([
	'jquery',
	'model/transactionSearch',
	'page/2column',
	'util/app',
	'util/common',
	'util/uri',
	'text!view/transactionMenu.html'
], function ($, TransactionSearch, Parent, app, common, URI, transactionMenuHtml) {

	return common.bless(Parent, 'page.Transaction', {
		setLeft: function (prevPage, $container) {
			var transactionSearch = this._addModel(prevPage, TransactionSearch, {});
			var $transactionMenuHtml = $(transactionMenuHtml).appendTo($container);
			transactionSearch.bind($transactionMenuHtml);
		}
	});

});