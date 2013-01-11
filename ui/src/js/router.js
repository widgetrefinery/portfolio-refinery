define([
	'sammy',
	'util/uri'
], function (sammy, URI) {

	var prevPage;

	var loadPage = function (pageName) {
		return function () {
			require([pageName], function (page) {
				URI.current(window.location.hash);
				prevPage = new page(prevPage);
			});
		};
	};

	var router = sammy(function () {
		this.get('#account', loadPage('page/accountList'));
		this.get('#account/_', loadPage('page/accountNew'));
		this.get('#account/:id', loadPage('page/accountEdit'));
		this.get('#investment', loadPage('page/investmentList'));
		this.get('#investment/_', loadPage('page/investmentNew'));
		this.get('#investment/:id', loadPage('page/investmentEdit'));
		this.get('#transaction', loadPage('page/transaction'));
		this.get('', function () {
			window.location.replace('#account');
		});
	});

	// modify sammy to ignore all form submissions
	router._checkFormSubmission = function () {
		return true;
	};

	URI.current.subscribe(function (newValue) {
		if (window.location.hash != newValue) {
			window.location.hash = newValue;
		}
	});

	return router;
});