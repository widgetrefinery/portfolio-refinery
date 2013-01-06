require([
	'jquery',
	'model/investmentList'
], function ($, InvestmentList) {

	module('model/investmentList');

	test('setData', function () {
		var model = new InvestmentList({uri: '/dummy/url', existing: true, parentDepth: -1});
		model.setData({
			url:         {
				self:          '/investment',
				addInvestment: '/investment/create'
			},
			investments: [
				{url: {self: '/investment/1'}, name: 'Investment 1', active: false},
				{url: {self: '/investment/3'}, name: 'Investment 3', active: true},
				{url: {self: '/investment/2'}, name: 'Investment 2', active: true}
			]
		});
		equal(model.addUri.url(), '/investment/create', 'checking addInvestment url');
		equal(model.entries().length, 3, 'all investments loaded');
		equal(model.entries()[0].uri.url(), '/investment/1', 'investments are sorted');
		equal(model.entries()[1].uri.url(), '/investment/2', 'investments are sorted');
		equal(model.entries()[2].uri.url(), '/investment/3', 'investments are sorted');
		model.setData({
			url: {
				self:          '/investment',
				addInvestment: '/investment/new'
			}
		});
		equal(model.addUri.url(), '/investment/new', 'checking addInvestment url');
		equal(model.entries().length, 0, 'all investments cleared');
	});

});