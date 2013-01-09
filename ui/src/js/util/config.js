define(function () {

	return {
		dom: {
			header: [
				'accountList',
				'investmentList',
				'transactionList'
			],
			rootId: 'content'
		},
		url: {
			accountList:     '/account',
			investmentList:  '/investment',
			transactionAdd:  '/transaction/_',
			transactionList: '/transaction'
		}
	};

});