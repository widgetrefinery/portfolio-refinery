define([
	'model/account',
	'model/accounts',
	'page/2panel',
	'util/app'
], function (account, accounts, Parent, app) {
	return app.bless(Parent, {
		setLeft:   function (prevPage, $container) {
			var accountsWidget = this.createWidget(prevPage, accounts, undefined, $container);
			accountsWidget.model.refresh();
		},
		setCenter: function (prevPage, $container) {
			var accountWidget = this.createWidget(prevPage, account, app.resource(location.hash), $container);
			accountWidget.model.refresh();
		}
	});
});