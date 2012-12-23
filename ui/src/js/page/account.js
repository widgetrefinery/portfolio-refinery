define([
	'jquery',
	'knockout',
	'model/accounts',
	'model/account',
	'page/2panel',
	'util/app'
], function ($, ko, accounts, account, parent, app) {
	return app.bless(parent, {
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