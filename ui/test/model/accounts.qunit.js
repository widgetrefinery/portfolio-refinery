require([
	'model/accounts',
	'util/app',
	'util/config',
	'jquery',
	'knockout',
	'jquery.mockjax'
], function (accounts, app, config, $, ko) {
	module('model/accounts');

	var ajaxWaitTimeout = 50;

	var setupMockjax = function () {
		var data = {
			url:      {
				self: '/account',
				add:  '/account/create'
			},
			accounts: [
				{url: {self: '/account/1'}, name: 'Account 1', active: false},
				{url: {self: '/account/3'}, name: 'Account 3', active: true},
				{url: {self: '/account/2'}, name: 'Account 2', active: true}
			]
		};
		$.mockjax({
			url:          config.url.accountList,
			type:         'GET',
			responseTime: 0,
			contentType:  'application/json',
			response:     function () {
				this.responseText = JSON.stringify(data)
			}
		});
		return data;
	};

	asyncTest('refresh', function () {
		var data = setupMockjax();
		var model = new accounts.Model();
		model.refresh();
		setTimeout(part1, ajaxWaitTimeout);

		function part1() {
			equal(model.accounts().length, 3, 'all accounts loaded');
			equal(model.accounts()[0].url.self(), '/account/1', 'accounts are sorted');
			equal(model.accounts()[1].url.self(), '/account/2', 'accounts are sorted');
			equal(model.accounts()[2].url.self(), '/account/3', 'accounts are sorted');
			data.accounts.push({url: {self: '/account/0'}, name: 'Account 0', active: false});
			model.refresh();
			setTimeout(part2, ajaxWaitTimeout);
		}

		function part2() {
			equal(model.accounts().length, 4, 'new account added');
			equal(model.accounts()[0].url.self(), '/account/0', 'accounts are sorted');
			equal(model.accounts()[1].url.self(), '/account/1', 'accounts are sorted');
			equal(model.accounts()[2].url.self(), '/account/2', 'accounts are sorted');
			equal(model.accounts()[3].url.self(), '/account/3', 'accounts are sorted');
			$.mockjaxClear();
			start();
		}
	});

	asyncTest('showAll', function () {
		setupMockjax();
		var model = new accounts.Model();
		model.refresh();
		setTimeout(part1, ajaxWaitTimeout);

		function part1() {
			equal(model.showAll(), false, 'showAll defaults to false');
			equal(model.accounts()[0].show(), false, 'account 1 is hidden');
			equal(model.accounts()[1].show(), true, 'account 2 is visible');
			equal(model.accounts()[2].show(), true, 'account 3 is visible');
			model.showAll(true);
			equal(model.accounts()[0].show(), true, 'account 1 is hidden');
			equal(model.accounts()[1].show(), true, 'account 2 is visible');
			equal(model.accounts()[2].show(), true, 'account 3 is visible');
			$.mockjaxClear();
			start();
		}
	});

	asyncTest('dom', function () {
		setupMockjax();
		var $root = $('<div>').hide().appendTo($('body'));
		var model = new accounts.Model();
		var $view = $(accounts.view).appendTo($root);
		ko.applyBindings(model, $view[0]);
		model.refresh();
		setTimeout(part1, ajaxWaitTimeout);

		function part1() {
			equal($root.find('.btn-group a').attr('href'), '#account/create', 'add account href is set');
			equal($root.find('.btn-group button').hasClass('active'), false, 'show all button is not selected');
			equal($root.find('li').length, 2, 'active accounts visible');
			equal($root.find('li:eq(0) a').attr('href'), '#account/2', 'account href is set');
			equal($root.find('li .muted').length, 0, 'no muted accounts');
			$root.find('.btn-group button').trigger('click');
			equal(model.showAll(), true, 'showAll enabled via dom');
			equal($root.find('.btn-group button').hasClass('active'), true, 'show all button is selected');
			equal($root.find('li').length, 3, 'all accounts visible');
			equal($root.find('li .muted').length, 1, '1 muted account');
			equal($root.find('li .muted').text(), 'Account 1', 'account 1 is muted');
			$root.remove();
			$.mockjaxClear();
			start();
		}
	});
});