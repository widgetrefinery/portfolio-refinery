define([
	'jquery',
	'model/header',
	'util/app',
	'util/common',
	'text!view/2column.html',
	'text!view/header.html'
], function ($, Header, app, common, layoutHtml, headerHtml) {

	return common.bless(app.BasePage, 'page.2column', {
		constructor: function (prevPage) {
			this._super(prevPage, 'page.2column', layoutHtml);
			this.setHeader(prevPage, $('#header'));
			this.setLeft(prevPage, $('#left').empty());
			this.setCenter(prevPage, $('#center').empty());
		},
		setHeader:   function (prevPage, $container) {
			var header = this._addModel(prevPage, Header);
			if (!prevPage || !prevPage._hasModel(Header)) {
				var $headerHtml = $(headerHtml).appendTo($container.empty());
				header.bind($headerHtml);
			}
		},
		setLeft:     function (prevPage, $container) {
			//for child class to populate left column
		},
		setCenter:   function (prevPage, $container) {
			//for child class to populate center column
		}
	});

});