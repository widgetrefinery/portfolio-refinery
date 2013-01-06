require([
	'model/investment'
], function (Investment) {

	module('model/investment');

	test('data', function () {
		var model = new Investment({uri: '/dummy/url', existing: true, parentDepth: -1});
		model.setData({
			url:    {
				self: '/dummy/investment/1'
			},
			name:   'investment 1',
			symbol: 'ticker symbol',
			type:   'BOND',
			active: true
		});
		equal(model.uri.url(), '/dummy/investment/1', 'checking uri');
		equal(model.name(), 'investment 1', 'checking name');
		equal(model.symbol(), 'ticker symbol', 'checking symbol');
		equal(model.type(), 'BOND', 'checking type');
		equal(model.active(), true, 'checking active');
		deepEqual(model.getData(), {name: 'investment 1', symbol: 'ticker symbol', type: 'BOND', active: true}, 'checking getData()');
	});

	test('types', function () {
		var model = new Investment({uri: '/dummy/url', existing: false, parentDepth: -1});
		deepEqual(model.types[1], {id: 'BL', desc: 'Bond (Long-Term)'}, 'investment type 1');
		deepEqual(model.types[2], {id: 'BM', desc: 'Bond (Medium-Term)'}, 'investment type 2');
		deepEqual(model.types[5], {id: 'DLG', desc: 'Domestic Large-Cap Growth'}, 'investment type 5');
	});

});