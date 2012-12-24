require([
	'jquery',
	'knockout',
	'model/accounts',
	'util/app',
	'util/config',
	'jquery.mockjax'
], function ($, ko, accounts, app, config) {
	module('model/accounts');

	var ajaxWaitTimeout = 50;

	var setupMockjax = function () {
		var data = {
			url:      {
				self:       '/account',
				addAccount: '/account/create'
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
			app.location('');
			equal($root.find('ul:eq(0) > li:eq(0) a').attr('href'), '#account/create', 'add account href is set');
			equal($root.find('ul:eq(1) > li').length, 2, 'active accounts rendered');
			equal($root.find('ul:eq(1) > li:eq(0) a').attr('href'), '#account/2', 'verified 1st active account');
			equal($root.find('ul:eq(2) > li').length, 1, 'inactive accounts rendered');
			equal($root.find('ul:eq(2) > li:eq(0) a').attr('href'), '#account/1', 'verified 1st inactive account');
			equal($root.find('.active').length, 0, 'no selected accounts');
			$root.find('ul:eq(0) > li:eq(3)').trigger('click');
			equal(model.showAll(), true, 'showAll enabled via dom');
			app.location('#account/2');
			equal($root.find('.active').length, 1, '1 selected accounts');
			equal($root.find('.active').text(), 'Account 2', 'account 2 is selected');
			$root.remove();
			$.mockjaxClear();
			start();
		}
	});
});