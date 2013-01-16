define([
	'jquery',
	'model/accountList',
	'util/uri',
	'text!view/list.html'
], function ($, AccountList, URI, html) {

	module('view/list');

	test('binding', function () {
		var $html = $(html).hide().appendTo($('body'));
		var model = new AccountList({uri: '/dummy/url', existing: true, parentDepth: -1});
		model.bind($html);
		model.setData({
			url:      {
				addAccount: '/account/create'
			},
			accounts: [
				{url: {self: '/account/1'}, name: 'Account 1', active: false},
				{url: {self: '/account/3'}, name: 'Account 3', active: true},
				{url: {self: '/account/2'}, name: 'Account 2', active: true},
				{url: {self: '/account/4'}, name: 'Account 4', active: false}
			]
		});
		//check basic bindings
		equal($html.children(':eq(0)').find('a').attr('href'), '#account/create', 'create account href');
		equal($html.children(':eq(2)').find('a').length, 2, 'active accounts list');
		equal($html.children(':eq(2)').find('a:eq(0)').text(), 'Account 2', 'active account 1 name');
		equal($html.children(':eq(2)').find('a:eq(1)').text(), 'Account 3', 'active account 2 name');
		equal($html.children(':eq(2)').find('a:eq(0)').attr('href'), '#account/2', 'active account 1 href');
		equal($html.children(':eq(2)').find('a:eq(1)').attr('href'), '#account/3', 'active account 2 href');
		equal($html.children(':eq(4)').find('a').length, 2, 'inactive accounts list');
		equal($html.children(':eq(4)').find('a:eq(0)').text(), 'Account 1', 'inactive account 1 name');
		equal($html.children(':eq(4)').find('a:eq(1)').text(), 'Account 4', 'inactive account 2 name');
		equal($html.children(':eq(4)').find('a:eq(0)').attr('href'), '#account/1', 'inactive account 1 href');
		equal($html.children(':eq(4)').find('a:eq(1)').attr('href'), '#account/4', 'inactive account 2 href');
		//toggle visibility of active accounts
		equal($html.children(':eq(2)').hasClass('in'), true, 'active accounts is shown');
		equal(model.show.active(), true, 'model matches view');
		$html.children(':eq(1)').trigger('click');
		equal(model.show.active(), false, 'model updated via dom');
		equal($html.children(':eq(2)').hasClass('in'), false, 'active accounts is hidden');
		//toggle visibility of inactive accounts
		equal($html.children(':eq(4)').hasClass('in'), false, 'inactive accounts is hidden');
		equal(model.show.inactive(), false, 'model matches view');
		$html.children(':eq(3)').trigger('click');
		equal(model.show.inactive(), true, 'model updated via dom');
		equal($html.children(':eq(4)').hasClass('in'), true, 'inactive accounts is shown');
		//check account highlighting
		URI.current('');
		equal($html.find('.active').length, 0, 'no accounts highlighted');
		URI.current('#account/create');
		equal($html.find('.active').length, 1, '1 account highlighted');
		equal($html.find('.active').find('a').attr('href'), '#account/create', 'new account highlighted');
		URI.current('#account/2');
		equal($html.find('.active').length, 1, '1 account highlighted');
		equal($html.find('.active').find('a').attr('href'), '#account/2', 'active account highlighted');
		URI.current('#account/4');
		equal($html.find('.active').length, 1, '1 account highlighted');
		equal($html.find('.active').find('a').attr('href'), '#account/4', 'inactive account highlighted');
		//cleanup
		$html.remove();
	});

});
