define([
	'knockout',
	'knockout.mapping',
	'util/app',
	'util/common',
	'util/uri'
], function (ko, kom, app, common, URI) {

	return common.bless(app.BaseModel, 'model.List', {
		constructor:   function (args) {
			this._super(args);
			this.addUri = new URI();
			this.entries = kom.fromJS([]);
			this.show = {
				active:   ko.observable(true),
				inactive: ko.observable(false)
			};
		},
		_parseEntries: function (entries) {
			entries.sort(function (a, b) {
				return a.name.localeCompare(b.name);
			});
			kom.fromJS(entries, {
				'': {
					key:    function (entry) {
						return ko.utils.unwrapObservable(entry.url.self);
					},
					create: function (options) {
						var entry = kom.fromJS(options.data);
						entry.uri = new URI(options.data.url.self);
						return entry;
					}
				}
			}, this.entries);
		}
	});

});