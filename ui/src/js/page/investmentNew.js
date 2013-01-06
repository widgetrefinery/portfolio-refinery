define([
	'jquery',
	'model/investment',
	'page/investmentList',
	'util/app',
	'util/common',
	'util/uri',
	'text!view/investmentEdit.html'
], function ($, Investment, Parent, app, common, URI, investmentEditHtml) {

	return common.bless(Parent, 'page.InvestmentNew', {
		setCenter: function (prevPage, $container) {
			var investment = new Investment({
				uri:         URI.subUri(URI.current(), 2),
				existing:    false,
				parentDepth: -1
			});
			var $investmentEditHtml = $(investmentEditHtml).appendTo($container);
			investment.bind($investmentEditHtml);
		}
	});

});