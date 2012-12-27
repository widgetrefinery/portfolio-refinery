define([
	'jquery',
	'model/account',
	'page/accountList',
	'util/app',
	'util/common',
	'util/uri',
	'text!view/accountToolbar.html'
], function ($, Account, Parent, app, common, URI, accountToolbarHtml) {

	return common.bless(Parent, 'page.Account', {
		setCenter:   function (prevPage, $container) {
			var account = this._addModel(prevPage, Account, {
				uri:         URI.subUri(URI.current(), 2),
				existing:    this._isExisting(),
				parentDepth: -1
			});
			var $accountToolbarHtml = $(accountToolbarHtml).appendTo($container);
			account.bind($accountToolbarHtml);
			account.refresh();
			this._renderBody(account, $container);
		},
		_isExisting: function () {
			return true;
		},
		_renderBody: function (account, $container) {
			//subclass can add additional views
		}
	});

});