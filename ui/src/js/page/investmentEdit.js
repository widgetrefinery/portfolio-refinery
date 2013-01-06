define([
	'jquery',
	'model/investment',
	'page/investmentList',
	'util/app',
	'util/common',
	'util/uri',
	'text!view/investmentEdit.html'
], function ($, Investment, Parent, app, common, URI, investmentEditHtml) {

	return common.bless(Parent, 'page.InvestmentEdit', {
		setCenter: function (prevPage, $container) {
			var investment = this._addModel(prevPage, Investment, {
				uri:         URI.subUri(URI.current(), 2),
				existing:    true,
				parentDepth: -1
			});
			var $investmentEditHtml = $(investmentEditHtml).appendTo($container);
			investment.bind($investmentEditHtml);
			investment.refresh();
		}
	});

});