define([
	'jquery',
	'knockout',
	'util/config'
], function ($, ko, config) {
	var bless = function (parentClass, classDef) {
		if (1 == arguments.length) {
			classDef = parentClass;
			parentClass = undefined;
		}
		//provide a default constructor if none was defined
		if (!classDef.hasOwnProperty('constructor')) {
			if (parentClass) {
				classDef.constructor = function () {
					this.supr.apply(this, arguments);
				};
			} else {
				classDef.constructor = function () {
				};
			}
		}
		var clazz = {};
		if (parentClass) {
			$.extend(clazz, parentClass.prototype);
			$.each(classDef, function (key, attr) {
				if (key in clazz) {
					attr.supr = clazz[key];
				}
				clazz[key] = attr;
			});
			//IE skips the constructor attribute so we explicitly wire it up here
			classDef.constructor.supr = parentClass.prototype.constructor;
			clazz.constructor = classDef.constructor;
			clazz.supr = function () {
				return arguments.callee.caller.supr.apply(this, arguments);
			};
		} else {
			clazz = classDef;
		}
		classDef.constructor.prototype = clazz;
		return classDef.constructor;
	};

	var resource = function (resource) {
		var href;
		var url;
		if (!resource || '/' == resource.substr(0, 1)) {
			url = ko.observable(resource);
			href = ko.computed({
				read:  function () {
					var _url = url();
					return _url ? '#' + _url.substr(1) : undefined;
				},
				write: function (href) {
					url(href ? '/' + href.substr(1) : undefined);
				}
			});
		} else {
			href = ko.observable(resource);
			url = ko.computed({
				read:  function () {
					var _href = href();
					return _href ? '/' + _href.substr(1) : undefined;
				},
				write: function (url) {
					href(url ? '#' + url.substr(1) : undefined);
				}
			});
		}
		return {
			href: href,
			url:  url
		};
	};

	var url = function (href) {
		return ko.computed({
			read:  function () {
				return '/' + href().substr(1);
			},
			write: function (url) {
				href('#' + url.substr(1));
			}
		});
	};

	var EventBus = bless({
		constructor: function () {
			this.bus = $({});
		},
		add:         function (eventName, listener) {
			return this.bus.on(eventName, listener);
		},
		remove:      function (eventName, listener) {
			this.bus.off(eventName, listener);
		},
		fire:        function (eventName, payload) {
			this.bus.trigger(eventName, payload);
		}
	});
	var eventBus = new EventBus();

	var BaseModel = bless({
		constructor: function (resource) {
			this.busy = ko.observable(false);
			this.resource = resource;
		},
		setBusy:     function (busy) {
			eventBus.fire('busy', busy);
			this.busy(busy);
		},
		refresh:     function () {
			this.setBusy(true);
			var self = this;
			$.ajax(this.resource.url(), {
				complete: function () {
					self.setBusy(false);
				},
				error:    function (xhr) {
					eventBus.fire('error', {status: xhr.status, msg: xhr.statusText});
				},
				success:  function (data) {
					self.setData(data);
				}
			});
		}
	});

	var BasePage = bless({
		constructor:  function (prevPage, layoutName, layoutHtml) {
			if (!prevPage || layoutName != prevPage.layoutName) {
				$('#' + config.dom.rootId).empty().append(layoutHtml);
			}
			this.layoutName = layoutName;
			this.widgets = {};
		},
		createWidget: function (prevPage, widgetDef, resource, $parent) {
			var widget = undefined;
			if (prevPage) {
				widget = prevPage.getWidget(widgetDef.name);
			}
			if (!widget) {
				widget = {model: new widgetDef.Model(resource)};
			}
			widget.$view = $(widgetDef.view).appendTo($parent);
			ko.applyBindings(widget.model, widget.$view[0]);
			this.widgets[widgetDef.name] = widget;
			return widget;
		},
		getWidget:    function (name) {
			return this.widgets[name];
		}
	});

	return {
		bless:     bless,
		resource:  resource,
		url:       url,
		eventBus:  eventBus,
		BaseModel: BaseModel,
		BasePage:  BasePage
	};
});