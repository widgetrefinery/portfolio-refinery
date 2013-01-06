define([
	'jquery',
	'model/investmentList',
	'page/2column',
	'util/app',
	'util/common',
	'util/uri',
	'text!view/list.html'
], function ($, InvestmentList, Parent, app, common, URI, listHtml) {

	return common.bless(Parent, 'page.InvestmentList', {
		setLeft: function (prevPage, $container) {
			var investments = this._addModel(prevPage, InvestmentList, {
				uri:         URI.subUri(URI.current(), 1),
				existing:    true,
				parentDepth: -1
			});
			var $investmentListHtml = $(listHtml).appendTo($container);
			investments.bind($investmentListHtml);
			investments.refresh();
		}
	});

});