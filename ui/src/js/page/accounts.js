define([
	'jquery',
	'knockout',
	'model/accounts',
	'page/2panel',
	'util/app'
], function ($, ko, accounts, parent, app) {
	return app.bless(parent, {
		constructor: function (prevPage) {
			this.supr(prevPage);
		},
		setLeft:     function (prevPage, $container) {
			var accountsWidget = this.createWidget(prevPage, accounts, undefined, $container);
			accountsWidget.model.refresh();
		}
	});
});