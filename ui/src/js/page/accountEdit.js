define([
	'jquery',
	'page/account',
	'util/app',
	'util/common',
	'text!view/accountEdit.html'
], function ($, Parent, app, common, accountEditHtml) {

	return common.bless(Parent, 'page.AccountEdit', {
		_renderBody: function (account, $container) {
			var $accountEditHtml = $(accountEditHtml).appendTo($container);
			account.bind($accountEditHtml);
		}
	});

});