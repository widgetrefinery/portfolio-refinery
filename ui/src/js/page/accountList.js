define([
	'jquery',
	'model/accounts',
	'page/2column',
	'util/app',
	'util/common',
	'util/uri',
	'text!view/accountList.html'
], function ($, Accounts, Parent, app, common, URI, accountListHtml) {

	return common.bless(Parent, 'page.AccountList', {
		setLeft: function (prevPage, $container) {
			var accounts = this._addModel(prevPage, Accounts, {
				uri:         URI.subUri(URI.current(), 1),
				existing:    true,
				parentDepth: -1
			});
			var $accountListHtml = $(accountListHtml).appendTo($container);
			accounts.bind($accountListHtml);
			accounts.refresh();
		}
	});

});