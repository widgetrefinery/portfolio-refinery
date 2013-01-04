define([
	'jquery',
	'util/app',
	'util/common',
	'util/config',
	'util/uri'
], function ($, app, common, config, URI) {

	return common.bless(app.BaseModel, 'model.Header', {
		constructor: function () {
			this._super({});
			this.entries = $.map(config.dom.header, function (entry) {
				return {
					name: entry.name,
					uri:  new URI(entry.href)
				}
			});
		}
	});

});