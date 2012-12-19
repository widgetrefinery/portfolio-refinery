requirejs.config({
	paths: {
		bootstrap:        'lib/bootstrap-2.2.2.min',
		jquery:           'lib/jquery-1.8.3.min',
		knockout:         'lib/knockout-2.2.0.min',
		sammy:            'lib/sammy-0.7.2.min',
		text:             'lib/require/text-2.0.3',
		'jquery.mockjax': '../../test/lib/jquery.mockjax-1.5.1'
	},
	shim:  {
		bootstrap:        ['jquery'],
		sammy:            ['jquery'],
		'jquery.mockjax': ['jquery']
	}
});
require(['jquery', 'router', 'bootstrap', 'jquery.mockjax'], function ($, router) {
	$.ajaxSetup({
		accepts: 'application/json',
		cache:   false,
		timeout: 4000
	});
	$.mockjax({
		url:          '/account',
		type:         'GET',
		contentType:  'application/json',
		responseText: JSON.stringify([
			{href: '/account/1', name: 'Account 1'},
			{href: '/account/2', name: 'Account 2'},
			{href: '/account/3', name: 'Account 3'}
		])
	});
	router.run();
});