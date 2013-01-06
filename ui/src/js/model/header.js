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
			var self = this;
			this.entries = $.map(config.dom.header, function (entry) {
				return {
					name: self.i18n.root['header_' + entry],
					uri:  new URI(config.url[entry])
				}
			});
		}
	});

});