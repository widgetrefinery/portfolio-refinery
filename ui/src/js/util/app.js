define([
	'jquery',
	'knockout',
	'util/common',
	'util/config',
	'util/uri'
], function ($, ko, common, config, URI) {

	var EventBus = common.bless('util.EventBus', {
		constructor: function () {
			this.bus = $({});
		},
		add:         function (eventName, listener) {
			return this.bus.on(eventName, listener);
		},
		remove:      function (eventName, listener) {
			if (listener) {
				this.bus.off(eventName, listener);
			} else {
				this.bus.off(eventName);
			}
		},
		fire:        function (eventName, payload) {
			this.bus.trigger(eventName, payload);
		}
	});
	var eventBus = new EventBus();

	var BaseModel = common.bless('util.BaseModel', {
		constructor:   function (args) {
			this.busy = ko.observable(false);
			this.uri = new URI(args.uri);
			this.__existing = args.existing;
			this.__parentDepth = args.parentDepth;
		},
		bind:          function ($html) {
			ko.applyBindings(this, $html[0]);
		},
		_setBusy:      function (busy) {
			this.busy(busy);
			eventBus.fire('busy', busy);
		},
		_ajaxComplete: function () {
			this._setBusy(false);
		},
		_ajaxError:    function (xhr) {
			eventBus.fire('error', {response: xhr});
		},
		refresh:       function () {
			if (this.__existing) {
				this._setBusy(true);
				$.ajax(this.uri.url(), {
					context:  this,
					complete: this._ajaxComplete,
					error:    this._ajaxError,
					success:  this.setData
				});
			}
		},
		save:          function () {
			var data = this.getData();
			if (data) {
				this._setBusy(true);
				$.ajax(this.uri.url(), {
					context:     this,
					contentType: 'application/json',
					data:        JSON.stringify(data),
					type:        'POST',
					complete:    this._ajaxComplete,
					error:       this._saveError,
					success:     this._saveSuccess
				});
			} else {
				this._saveSuccess();
			}
		},
		_saveSuccess:  function () {
			URI.current(this.uri.href());
		},
		_saveError:    function (xhr) {
			if (302 == xhr.status) {
				URI.current(new URI(xhr.getResponseHeader('location')).href());
			} else {
				this._ajaxError(xhr);
			}
		},
		del:           function () {
			this._setBusy(true);
			$.ajax(this.uri.url(), {
				context:  this,
				type:     'DELETE',
				complete: this._ajaxComplete,
				error:    this._ajaxError,
				success:  this._delSuccess
			});
		},
		_delSuccess:   function () {
			URI.current(URI.subUri(this.uri.href(), this.__parentDepth));
		}
	});

	var BasePage = common.bless('util.BasePage', {
		constructor: function (prevPage, layoutName, layoutHtml) {
			if (!prevPage || layoutName != prevPage.__layoutName) {
				$('#' + config.dom.rootId).empty().append(layoutHtml);
			}
			this.__layoutName = layoutName;
			this.__models = {};
		},
		_addModel:   function (prevPage, clazz, args) {
			var model = this.__models[clazz._name];
			if (!model && prevPage) {
				model = prevPage.__models[clazz._name];
			}
			if (!model) {
				model = new clazz(args);
			}
			this.__models[clazz._name] = model;
			return model;
		}
	});

	return {
		eventBus:  eventBus,
		BaseModel: BaseModel,
		BasePage:  BasePage
	};

});