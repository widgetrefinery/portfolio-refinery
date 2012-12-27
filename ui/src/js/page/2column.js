define([
	'jquery',
	'util/app',
	'util/common',
	'text!view/2column.html'
], function ($, app, common, layoutHtml) {

	return common.bless(app.BasePage, 'page.2column', {
		constructor: function (prevPage) {
			this._super(prevPage, 'page.2column', layoutHtml);
			this.setLeft(prevPage, $('#left').empty());
			this.setCenter(prevPage, $('#center').empty());
		},
		setLeft:     function (prevPage, $container) {
			//for child class to populate left column
		},
		setCenter:   function (prevPage, $container) {
			//for child class to populate center column
		}
	});

});