define([
	'jquery',
	'model/header',
	'util/config',
	'util/uri'
], function ($, Header, config, URI) {

	module('model/header');

	test('init', function () {
		var model = new Header();
		equal(model.entries.length, config.dom.header.length, 'header entries populated');
		equal(model.entries[1].uri.url(), '/investment', 'entry 1 href');
		equal(model.entries[1].name, 'Investments', 'entry 1 name');
		URI.current(model.entries[0].uri.href());
		equal(model.entries[0].uri.active(), true, 'entry 0 is active');
		equal(model.entries[1].uri.active(), false, 'entry 1 is inactive');
		URI.current(model.entries[1].uri.href());
		equal(model.entries[0].uri.active(), false, 'entry 0 is inactive');
		equal(model.entries[1].uri.active(), true, 'entry 1 is active');
	});

});
