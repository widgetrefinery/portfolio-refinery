require([
	'jquery',
	'model/account',
	'text!view/accountEdit.html'
], function ($, Account, html) {

	module('view/accountEdit');

	test('binding', function () {
		var $html = $(html).hide().appendTo($('body'));
		var saveInvoked = false;
		var model = new Account('/dummy/url', true);
		model.save = function () {
			//intercept and log calls to save()
			saveInvoked = true;
		};
		model.bind($html);
		model.setData({
			name:   'test account',
			active: true
		});
		equal($html.find('#account-name').val(), 'test account', 'name input');
		equal($html.find('#account-active').attr('checked'), 'checked', 'active checkbox');
		model.setData({
			name:   'test account 2',
			active: false
		});
		equal($html.find('#account-name').val(), 'test account 2', 'name input');
		equal($html.find('#account-active').attr('checked'), undefined, 'active checkbox');
		equal(saveInvoked, false, 'save had not been called');
		$html.trigger('submit');
		equal(saveInvoked, true, 'save had been called');
		//cleanup
		$html.remove();
	});

});