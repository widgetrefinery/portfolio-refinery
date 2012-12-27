require([
	'jquery',
	'model/account',
	'util/uri',
	'text!view/accountToolbar.html'
], function ($, Account, URI, html) {

	module('view/accountToolbar');

	test('binding', function () {
		var $html = $(html).hide().appendTo($('body'));
		var delInvoked = false;
		var model = new Account({uri: '/dummy/url', existing: true, parentDepth: -1});
		model.del = function () {
			//intercept and log calls to del()
			delInvoked = true;
		};
		model.bind($html);
		model.setData({
			url:    {
				self:     '/account/1',
				addEntry: '/account/1/entry/create'
			},
			name:   'account 1',
			active: true
		});
		equal($html.find('a:eq(0)').attr('href'), '#account/1/entry/create', 'add entry href');
		equal($html.find('a:eq(1)').attr('href'), undefined, 'edit entry href is blank');
		equal($html.find('a:eq(1)').hasClass('disabled'), true, 'edit entry button is disabled');
		model.selectedEntry({uri: new URI('/account/1/entry/2')});
		equal($html.find('a:eq(1)').attr('href'), '#account/1/entry/2', 'edit entry href is set');
		equal($html.find('a:eq(1)').hasClass('disabled'), false, 'edit entry button is not disabled');
		equal($html.find('a:eq(3)').attr('href'), '#account/1/edit', 'edit href');
		equal(delInvoked, false, 'del had not been called');
		$html.find('a:eq(4)').trigger('click');
		equal(delInvoked, true, 'del had been called');
		//cleanup
		$html.remove();
	});
});