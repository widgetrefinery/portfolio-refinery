require([
	'jquery',
	'model/account'
], function ($, Account) {

	module('model/account');

	test('data', function () {
		var model = new Account({uri: '/dummy/url', existing: true, parentDepth: -1});
		model.setData({
			url:    {
				self:     '/dummy/account/1',
				addEntry: '/dummy/account/1/entry/create'
			},
			name:   'account 1',
			active: true
		});
		equal(model.uri.url(), '/dummy/account/1', 'checking uri');
		equal(model.editHref(), '#dummy/account/1/edit', 'checking edit href');
		equal(model.addEntryUri.url(), '/dummy/account/1/entry/create', 'checking addEntry uri');
		equal(model.name(), 'account 1', 'checking name');
		equal(model.active(), true, 'checking active');
		deepEqual(model.getData(), {name: 'account 1', active: true}, 'checking getData()');
	});

});