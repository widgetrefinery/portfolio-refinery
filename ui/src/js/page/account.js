define([
	'model/account',
	'model/accounts',
	'page/2panel',
	'util/app'
], function (account, accounts, Parent, app) {
	return app.bless(Parent, {
		setLeft:         function (prevPage, $container) {
			var accountsWidget = this.createWidget(prevPage, accounts, undefined, $container);
			accountsWidget.model.refresh();
		},
		setCenter:       function (prevPage, $container) {
			var accountWidget = this.createWidget(prevPage, account, app.resource(this._getAccountHref()), $container);
			accountWidget.model.refresh();
			this._renderBody($container);
		},
		_getAccountHref: function () {
			return app.location();
		},
		_renderBody:     function ($container) {
			//subclass can add additional widgets
		}
	});
});