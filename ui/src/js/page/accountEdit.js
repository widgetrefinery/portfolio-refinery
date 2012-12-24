define([
	'jquery',
	'knockout',
	'model/account',
	'page/account',
	'util/app',
	'text!view/accountEdit.html'
], function ($, ko, account, Parent, app, view) {
	return app.bless(Parent, {
		_getAccountHref: function () {
			var href = app.location();
			return href.substring(0, href.length - '/edit'.length);
		},
		_renderBody:     function ($container) {
			var $view = $(view).appendTo($container);
			ko.applyBindings(this.getWidget(account.name).model, $view[0]);
		}
	});
});