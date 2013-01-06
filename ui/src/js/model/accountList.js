define([
	'model/list',
	'util/common'
], function (List, common) {

	return common.bless(List, 'model.AccountList', {
		constructor: function (args) {
			this._super(args);
			this.i18n.model = {
				list_add:      this.i18n.root.list_account_add,
				list_active:   this.i18n.root.list_account_active,
				list_inactive: this.i18n.root.list_account_inactive
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