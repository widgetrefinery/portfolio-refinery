define(['jquery', 'knockout'], function ($, ko) {
	const bless = function (parentClass, classDef) {
		if (1 == arguments.length) {
			classDef = parentClass;
			parentClass = undefined;
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

	const createWidget = function (widget, resource, $container) {
		var model = new widget.Model(resource);
		var $view = $(widget.view);
		$container.append($view);
		ko.applyBindings(model, $view[0]);
		return {
			model: model,
			$view: $view
		};
	};

	const resource = function (resource) {
		var href;
		var url;
		if ('#' == resource.substr(0, 1)) {
			href = ko.observable(resource);
			url = ko.computed({
				read:  function () {
					return '/' + href().substr(1);
				},
				write: function (url) {
					href('#' + url.substr(1));
				}
			});
		} else {
			url = ko.observable(resource);
			href = ko.computed({
				read:  function () {
					return '#' + url().substr(1);
				},
				write: function (href) {
					url('/' + href.substr(1));
				}
			});
		}
		return {
			href: href,
			url:  url
		};
	};

	const url = function (href) {
		return ko.computed({
			read:  function () {
				return '/' + href().substr(1);
			},
			write: function (url) {
				href('#' + url.substr(1));
			}
		});
	};

	const EventBus = bless({
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
	const eventBus = new EventBus();

	const BaseModel = bless({
		constructor: function (resource) {
			this.busy = ko.observable(false);
			this.href = resource.href;
			this.url = resource.url;
		},
		setBusy:     function (busy) {
			eventBus.fire("busy", busy);
			this.busy(busy);
		},
		refresh:     function () {
			this.setBusy(true);
			const self = this;
			$.ajax(this.url(), {
				complete: function () {
					self.setBusy(false);
				},
				error:    function (xhr) {
					eventBus.fire("error", {status: xhr.status, msg: xhr.statusText});
				},
				success:  function (data) {
					self.setData(data);
				}
			});
		}
	});

	return {
		bless:        bless,
		createWidget: createWidget,
		resource:     resource,
		url:          url,
		eventBus:     eventBus,
		BaseModel:    BaseModel
	};
});