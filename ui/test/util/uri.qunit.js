require([
	'util/uri'
], function (URI) {

	module('util/uri');

	test('goUp', function () {
		URI.current(undefined);
		URI.goUp();
		equal(URI.current(), undefined, 'goUp() from undefined is still undefined');
		URI.current('');
		URI.goUp();
		equal(URI.current(), '', 'goUp() from empty string is still empty string');
		URI.current('#');
		URI.goUp();
		equal(URI.current(), '#', 'goUp() from # is #');
		URI.current('#root');
		URI.goUp();
		equal(URI.current(), '#', 'goUp() from #root is #');
		URI.current('#bread/crumb');
		URI.goUp();
		equal(URI.current(), '#bread', 'goUp() from #bread/crumb is #bread');
	});

	test('URI', function () {
		URI.current('');
		//test initial value
		var uri = new URI();
		equal(uri.href(), undefined, 'href from undefined');
		equal(uri.url(), undefined, 'url from undefined');
		equal(uri.active(), false, 'active from undefined');
		uri = new URI('#an/href');
		equal(uri.href(), '#an/href', 'href from href');
		equal(uri.url(), '/an/href', 'url from href');
		equal(uri.active(), false, 'active from href');
		uri = new URI('/a/url');
		equal(uri.href(), '#a/url', 'href from url');
		equal(uri.url(), '/a/url', 'url from url');
		equal(uri.active(), false, 'active from url');
		//test getters/setters
		uri.href('#another/href');
		equal(uri.href(), '#another/href', 'set href via href');
		equal(uri.url(), '/another/href', 'set url via href');
		uri.url('/another/url');
		equal(uri.href(), '#another/url', 'set href via url');
		equal(uri.url(), '/another/url', 'set url via url');
		//test active
		uri.url('/a/url');
		URI.current('#a');
		equal(uri.active(), false, 'uri is more specific than current');
		URI.current('#a/url');
		equal(uri.active(), true, 'uri is the same as current');
		URI.current('#a/url/link');
		equal(uri.active(), true, 'uri is less specific than current');
		URI.current('#a/urls');
		equal(uri.active(), false, 'uri is a substring of current but not related');
	});

});