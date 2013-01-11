define([
	'jquery',
	'model/account',
	'page/accountList',
	'util/app',
	'util/common',
	'util/uri',
	'text!view/accountEdit.html'
], function ($, Account, Parent, app, common, URI, accountEditHtml) {

	return common.bless(Parent, 'page.AccountEdit', {
		setCenter: function (prevPage, $container) {
			var account = this._addModel(prevPage, Account, {
				uri:         URI.subUri(URI.current(), 2),
				existing:    true,
				parentDepth: -1
			});
			var $accountEditHtml = $(accountEditHtml).appendTo($container);
			account.bind($accountEditHtml);
			account.refresh();
		}
	});

});