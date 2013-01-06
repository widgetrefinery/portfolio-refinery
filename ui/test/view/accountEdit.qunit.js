require([
	'jquery',
	'model/account',
	'text!view/accountEdit.html'
], function ($, Account, html) {

	module('view/accountEdit');

	test('binding', function () {
		//setup
		var $html = $(html).hide().appendTo($('body'));
		var saveInvoked = false;
		var cancelInvoked = false;
		var model = new Account({uri: '/dummy/url', existing: true, parentDepth: -1});
		model.save = function () {
			//intercept and log calls to save()
			saveInvoked = true;
			return false;
		};
		model.cancel = function () {
			//intercept and log calls to cancel()
			cancelInvoked = true;
			return false;
		};
		model.bind($html);
		//set data and check dom
		model.setData({
			url:    {
				self:     '/account/1',
				addEntry: '/account/1/transaction/create'
			},
			name:   'test account',
			active: true
		});
		equal($html.find('#account-name').val(), 'test account', 'name input');
		equal($html.find('#account-active').attr('checked'), 'checked', 'active checkbox');
		model.setData({
			url:    {
				self:     '/account/2',
				addEntry: '/account/2/transaction/create'
			},
			name:   'test account 2',
			active: false
		});
		equal($html.find('#account-name').val(), 'test account 2', 'name input');
		equal($html.find('#account-active').attr('checked'), undefined, 'active checkbox');
		//test form buttons
		equal(saveInvoked, false, 'save had not been called');
		$html.trigger('submit');
		equal(saveInvoked, true, 'save had been called');
		equal(cancelInvoked, false, 'cancel had not been called');
		$html.find('button:eq(1)').trigger('click');
		equal(cancelInvoked, true, 'cancel had been called');
		//cleanup
		$html.remove();
	});

});