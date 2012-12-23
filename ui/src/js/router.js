define(['sammy'], function (sammy) {
	var prevPage;

	var loadPage = function (pageName) {
		return function () {
			require([pageName], function (page) {
				prevPage = new page(prevPage);
			});
		};
	};

	return sammy(function () {
		this.get('#account', loadPage('page/accounts'));
		this.get('#account/:id', loadPage('page/account'));
		this.get('', loadPage('page/accounts'));
	});
});