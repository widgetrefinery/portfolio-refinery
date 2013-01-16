define([
	'jquery',
	'model/transactionSearch',
	'util/uri',
	'text!view/transactionMenu.html'
], function ($, TransactionSearch, URI, html) {

	module('view/transactionMenu');

	test('binding', function () {
		//setup
		var $html = $(html).hide().appendTo($('body'));
		var searchInvoked = false;
		var model = new TransactionSearch({existing: true, parentDepth: -1});
		model.search = function () {
			//intercept and log calls to search()
			searchInvoked = true;
			return false;
		};
		model.bind($html);
		//test binding
		model.searchParams.startDate('2001-02-03');
		model.searchParams.endDate('2002-03-04');
		model.searchParams.account('Account 1');
		model.searchParams.investment('Investment 2');
		model.searchParams.type('B');
		equal($html.find('a:eq(0)').attr('href'), '#transaction/_', 'add transaction link');
		equal($html.find('input:eq(0)').val(), '2001-02-03', 'startDate input');
		equal($html.find('input:eq(1)').val(), '2002-03-04', 'endDate input');
		equal($html.find('input:eq(2)').val(), 'Account 1', 'account input');
		equal($html.find('input:eq(3)').val(), 'Investment 2', 'investment input');
		equal($html.find('select').val(), 'B', 'type input');
		$html.find('button:eq(1)').trigger('click');
		equal(model.searchParams.startDate(), '', 'startDate reset');
		equal(model.searchParams.endDate(), '', 'endDate reset');
		equal(model.searchParams.account(), '', 'account reset');
		equal(model.searchParams.investment(), '', 'investment reset');
		equal(model.searchParams.type(), '', 'type reset');
		//test search buttons
		equal(searchInvoked, false, 'search had not been called');
		$html.find('button:eq(0)').trigger('click');
		equal(searchInvoked, true, 'search had been called');
		//cleanup
		$html.remove();
	});

});
