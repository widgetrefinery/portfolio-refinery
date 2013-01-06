define([
	'model/list',
	'util/common'
], function (List, common) {

	return common.bless(List, 'model.InvestmentList', {
		constructor: function (args) {
			this._super(args);
			this.i18n = {
				list: this.i18n.list.investment
			};
		},
		setData:     function (data) {
			this.addUri.url(data.url.addInvestment);
			if (data.investments) {
				this._parseEntries(data.investments);
			} else {
				this.entries.removeAll();
			}
		}
	});

});