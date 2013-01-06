define([
	'jquery',
	'model/accountList',
	'page/2column',
	'util/app',
	'util/common',
	'util/uri',
	'text!view/list.html'
], function ($, AccountList, Parent, app, common, URI, listHtml) {

	return common.bless(Parent, 'page.AccountList', {
		setLeft: function (prevPage, $container) {
			var accounts = this._addModel(prevPage, AccountList, {
				uri:         URI.subUri(URI.current(), 1),
				existing:    true,
				parentDepth: -1
			});
			var $accountListHtml = $(listHtml).appendTo($container);
			accounts.bind($accountListHtml);
			accounts.refresh();
		}
	});

});