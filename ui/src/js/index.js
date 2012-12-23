requirejs.config({
	paths: {
		'bootstrap':        'lib/bootstrap-2.2.2.min',
		'jquery':           'lib/jquery-1.8.3.min',
		'knockout':         'lib/knockout/knockout-2.2.0.min',
		'knockout.mapping': 'lib/knockout/knockout.mapping-2.3.5.min',
		'sammy':            'lib/sammy-0.7.2.min',
		'text':             'lib/require/text-2.0.3',
		'jquery.mockjax':   '../../test/lib/jquery.mockjax-1.5.1'
	},
	shim:  {
		'bootstrap':      ['jquery'],
		'sammy':          ['jquery'],
		'jquery.mockjax': ['jquery']
	}
});
require([
	'jquery',
	'router',
	'bootstrap',
	'binding/bsToggleBtn',
	'jquery.mockjax'
], function ($, router) {
	$.ajaxSetup({
		accepts: 'application/json',
		cache:   false,
		timeout: 4000
	});
	$.mockjax({
		url:          '/account',
		type:         'GET',
		contentType:  'application/json',
		responseText: JSON.stringify({
			url:      {
				self: '/account',
				add:  '/account/create'
			},
			accounts: [
				{url: {self: '/account/1'}, name: 'Account 1', active: false},
				{url: {self: '/account/2'}, name: 'Account 2', active: true},
				{url: {self: '/account/3'}, name: 'Account 3', active: true}
			]
		})
	});
	$.mockjax({
		url:          '/account/*',
		type:         'GET',
		contentType:  'application/json',
		responseText: JSON.stringify({
			url:    {
				self: '/account/2'
			},
			name:   'Account 2',
			active: true
		})
	});
	router.run();
});