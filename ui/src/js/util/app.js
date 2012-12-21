define(['jquery', 'knockout'], function ($, ko) {
	var bless = function (parentClass, classDef) {
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
		constructor: function (href) {
			this.busy = ko.observable(false);
			this.href = href;
		},
		setBusy:     function (busy) {
			eventBus.fire("busy", busy);
			this.busy(busy);
		},
		refresh:     function () {
			this.setBusy(true);
			var self = this;
			$.ajax(this.href, {
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
		bless:     bless,
		eventBus:  eventBus,
		BaseModel: BaseModel
	};
});