define([
	'model/list',
	'util/common'
], function (List, common) {

	return common.bless(List, 'model.AccountList', {
		constructor: function (args) {
			this._super(args);
			this.i18n = {
				list: this.i18n.list.account
			};
		},
		setData:     function (data) {
			this.addUri.url(data.url.addAccount);
			if (data.accounts) {
				this._parseEntries(data.accounts);
			} else {
				this.entries.removeAll();
			}
		}
	});

});