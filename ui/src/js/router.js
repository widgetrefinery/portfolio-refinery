define(['sammy'], function (sammy) {
	return sammy(function () {
		this.get('#account', function () {
			require(['page/accounts'], function (accounts) {
				new accounts();
			});
		});
		this.get('#account/:id', function () {
			require(['page/account'], function (account) {
				new account();
			});
		});
		this.get('', function () {
			location.hash = 'account';
		});
	});
});