define(['sammy', 'util/app'], function (sammy, app) {
	var prevPage;

	var loadPage = function (pageName) {
		return function () {
			require([pageName], function (page) {
				prevPage = new page(prevPage);
			});
		};
	};

	var router = sammy(function () {
		this.get('#account', loadPage('page/accounts'));
		this.get('#account/:id', loadPage('page/account'));
		this.get('#account/:id/edit', loadPage('page/accountEdit'));
		this.get('', loadPage('page/accounts'));
	});

	// modify sammy to ignore all form submissions
	router._checkFormSubmission = function () {
		return true;
	};

	app.location.subscribe(function (newValue) {
		if (window.location.hash != newValue) {
			window.location.hash = newValue;
		}
	});

	return router;
});