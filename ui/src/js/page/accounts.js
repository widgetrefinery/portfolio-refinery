define([
	'model/accounts',
	'page/2panel',
	'util/app'
], function (accounts, Parent, app) {
	return app.bless(Parent, {
		setLeft: function (prevPage, $container) {
			var accountsWidget = this.createWidget(prevPage, accounts, undefined, $container);
			accountsWidget.model.refresh();
		}
	});
});