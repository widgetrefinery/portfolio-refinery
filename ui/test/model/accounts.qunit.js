require(['model/accounts', 'util/api', 'util/app', 'jquery', 'jquery.mockjax'], function (accounts, api, app, $) {
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
			url:          api.url.accountList,
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
		var $root = $('<div>');
		var widget = app.createWidget(accounts, undefined, $root);
		widget.model.refresh();
		setTimeout(part1, ajaxWaitTimeout);

		function part1() {
			equal(widget.model.accounts().length, 3, 'all accounts loaded');
			equal(widget.model.accounts()[0].url.self(), '/account/1', 'accounts are sorted');
			equal(widget.model.accounts()[1].url.self(), '/account/2', 'accounts are sorted');
			equal(widget.model.accounts()[2].url.self(), '/account/3', 'accounts are sorted');
			data.accounts.push({url: {self: '/account/0'}, name: 'Account 0', active: false});
			widget.model.refresh();
			setTimeout(part2, ajaxWaitTimeout);
		}

		function part2() {
			equal(widget.model.accounts().length, 4, 'new account added');
			equal(widget.model.accounts()[0].url.self(), '/account/0', 'accounts are sorted');
			equal(widget.model.accounts()[1].url.self(), '/account/1', 'accounts are sorted');
			equal(widget.model.accounts()[2].url.self(), '/account/2', 'accounts are sorted');
			equal(widget.model.accounts()[3].url.self(), '/account/3', 'accounts are sorted');
			$.mockjaxClear();
			start();
		}
	});

	asyncTest('showAll', function () {
		setupMockjax();
		var $root = $('<div>');
		var widget = app.createWidget(accounts, undefined, $root);
		widget.model.refresh();
		setTimeout(part1, ajaxWaitTimeout);

		function part1() {
			equal(widget.model.showAll(), false, 'showAll defaults to false');
			equal(widget.model.accounts()[0].show(), false, 'account 1 is hidden');
			equal(widget.model.accounts()[1].show(), true, 'account 2 is visible');
			equal(widget.model.accounts()[2].show(), true, 'account 3 is visible');
			widget.model.showAll(true);
			equal(widget.model.accounts()[0].show(), true, 'account 1 is hidden');
			equal(widget.model.accounts()[1].show(), true, 'account 2 is visible');
			equal(widget.model.accounts()[2].show(), true, 'account 3 is visible');
			$.mockjaxClear();
			start();
		}
	});

	asyncTest('dom', function () {
		setupMockjax();
		var $root = $('<div>').hide().appendTo($('body'));
		var widget = app.createWidget(accounts, undefined, $root);
		widget.model.refresh();
		setTimeout(part1, ajaxWaitTimeout);

		function part1() {
			equal($root.find('.btn-group a').attr('href'), '#account/create', 'add account href is set');
			equal($root.find('.btn-group button').hasClass('active'), false, 'show all button is not selected');
			equal($root.find('li').length, 2, 'active accounts visible');
			equal($root.find('li:eq(0) a').attr('href'), '#account/2', 'account href is set');
			equal($root.find('li .muted').length, 0, 'no muted accounts');
			$root.find('.btn-group button').trigger('click');
			equal(widget.model.showAll(), true, 'showAll enabled via dom');
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