require([
	'jquery',
	'model/investment',
	'text!view/investmentEdit.html'
], function ($, Investment, html) {

	module('view/investmentEdit');

	test('binding', function () {
		//setup
		var $html = $(html).hide().appendTo($('body'));
		var saveInvoked = false;
		var cancelInvoked = false;
		var deleteInvoked = false;
		var model = new Investment({uri: '/dummy/url', existing: true, parentDepth: -1});
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
		model.del = function () {
			//intercept and log calls to delete()
			deleteInvoked = true;
			return false;
		};
		model.bind($html);
		//set data and check dom
		model.setData({
			url:    {
				self: '/investment/1'
			},
			name:   'Investment 1',
			symbol: 'VFITX',
			type:   'BM',
			active: true
		});
		equal($html.find('#investment-name').val(), 'Investment 1', 'name input');
		equal($html.find('#investment-symbol').val(), 'VFITX', 'symbol input');
		equal($html.find('#investment-type').val(), 'BM', 'type input');
		equal($html.find('#investment-active').attr('checked'), 'checked', 'active checkbox');
		//test form buttons
		equal(saveInvoked, false, 'save had not been called');
		$html.trigger('submit');
		equal(saveInvoked, true, 'save had been called');
		equal(cancelInvoked, false, 'cancel had not been called');
		$html.find('button:eq(1)').trigger('click');
		equal(cancelInvoked, true, 'cancel had been called');
		equal(deleteInvoked, false, 'delete had not been called');
		$html.find('button:eq(2)').trigger('click');
		equal(deleteInvoked, true, 'delete had been called');
		//cleanup
		$html.remove();
	});

});