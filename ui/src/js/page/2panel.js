define(['jquery', 'util/app', 'text!page/2panel.html'], function ($, app, html) {
	return app.bless(app.BasePage, {
		constructor: function (prevPage) {
			this.supr(prevPage, '2panel', html);
			this.setLeft(prevPage, $('#left').empty());
			this.setCenter(prevPage, $('#center').empty());
		},
		setLeft:     function (prevPage, $container) {
			//for child class to populate left panel
		},
		setCenter:   function (prevPage, $container) {
			//for child class to populate center panel
		}
	});
});