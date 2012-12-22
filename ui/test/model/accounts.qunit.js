require(['model/accounts', 'util/api', 'util/app', 'jquery', 'jquery.mockjax'], function (accounts, api, app, $) {
	module('model/accounts');

	const ajaxWaitTimeout = 50;

	const setupMockjax = function () {
		var data = [
			{href: '/account/1', name: 'Account 1', active: false},
			{href: '/account/3', name: 'Account 3', active: true},
			{href: '/account/2', name: 'Account 2', active: true}
		];
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
			equal(widget.model.accounts()[0].href(), '/account/1', 'accounts are sorted');
			equal(widget.model.accounts()[1].href(), '/account/2', 'accounts are sorted');
			equal(widget.model.accounts()[2].href(), '/account/3', 'accounts are sorted');
			data.push({href: '/account/0', name: 'Account 0', active: false});
			widget.model.refresh();
			setTimeout(part2, ajaxWaitTimeout);
		}

		function part2() {
			equal(widget.model.accounts().length, 4, 'new account added');
			equal(widget.model.accounts()[0].href(), '/account/0', 'accounts are sorted');
			equal(widget.model.accounts()[1].href(), '/account/1', 'accounts are sorted');
			equal(widget.model.accounts()[2].href(), '/account/2', 'accounts are sorted');
			equal(widget.model.accounts()[3].href(), '/account/3', 'accounts are sorted');
			$.mockjaxClear();
			start();
		}
	});

	asyncTest('filter', function () {
		setupMockjax();
		var $root = $('<div>').hide().appendTo($('body'));
		var widget = app.createWidget(accounts, undefined, $root);
		widget.model.refresh();
		setTimeout(part1, ajaxWaitTimeout);

		function part1() {
			equal(widget.model.showAll(), false, 'only show active accounts by default');
			equal($root.find('a').length, 2, 'only active accounts are shown in dom');
			equal($root.find('a:eq(0)').text(), 'Account 2', 'account 2 is visible');
			equal($root.find('a:eq(1)').text(), 'Account 3', 'account 3 is visible');
			widget.model.showAll(true);
			equal($root.find('a').length, 3, 'all accounts are shown');
			equal($root.find('a:eq(0)').text(), 'Account 1', 'account 1 is visible');
			equal($root.find('a:eq(1)').text(), 'Account 2', 'account 2 is visible');
			equal($root.find('a:eq(2)').text(), 'Account 3', 'account 3 is visible');
			$root.remove();
			$.mockjaxClear();
			start();
		}
	});
});