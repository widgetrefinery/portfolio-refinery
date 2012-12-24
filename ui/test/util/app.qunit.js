require([
	'jquery',
	'knockout',
	'util/app',
	'util/config',
	'jquery.mockjax'
], function ($, ko, app, config) {
	module('util/app');

	test('bless', function () {
		var Parent = app.bless({
			constructor: function (value) {
				this.value = value + ' - Parent';
			},
			check:       function () {
				return '[Parent] ' + this.value;
			},
			getValue:    function () {
				return '[Parent] ' + this.value;
			}
		});
		var Child = app.bless(Parent, {
			constructor: function (value) {
				this.supr(value + ' - Child');
			},
			getValue:    function (callParent) {
				if (callParent) {
					return this.supr();
				} else {
					return '[Child] ' + this.value;
				}
			}
		});
		var Grandchild = app.bless(Child, {
			constructor: function (value) {
				this.supr(value + ' - Grandchild');
			},
			getValue:    function (callParent) {
				if (callParent) {
					return this.supr(callParent);
				} else {
					return '[Grandchild] ' + this.value;
				}
			}
		});
		var Parent2 = app.bless(Parent, {
			getValue: function () {
				return '[Parent2] ' + this.value;
			}
		});

		var parent = new Parent('val1');
		var child = new Child('val2');
		var grandchild = new Grandchild('val3');
		var parent2 = new Parent2('val4');
		equal(parent.check(), '[Parent] val1 - Parent', 'Parent is properly initialized');
		equal(child.check(), '[Parent] val2 - Child - Parent', 'Child is properly initialized');
		equal(grandchild.check(), '[Parent] val3 - Grandchild - Child - Parent', 'Grandchild is properly initialized');
		equal(parent2.check(), '[Parent] val4 - Parent', 'Parent2 is property initialized');
		equal(child.getValue(), '[Child] val2 - Child - Parent', 'Child overwrote getValue()');
		equal(child.getValue(true), '[Parent] val2 - Child - Parent', 'Child called Parent.getValue()');
		equal(grandchild.getValue(), '[Grandchild] val3 - Grandchild - Child - Parent', 'Grandchild overwrote getValue()');
		equal(grandchild.getValue(true), '[Parent] val3 - Grandchild - Child - Parent', 'Grandchild called Parent.getValue()');
		equal(parent2.getValue(), '[Parent2] val4 - Parent', 'Parent2 overwrote getValue()');
	});

	test('resource', function () {
		//create resource via href string
		var resource = app.resource('#an/href');
		equal(resource.href(), '#an/href', 'href parsed from an href');
		equal(resource.url(), '/an/href', 'url parsed from an href');
		resource.href('#another/href');
		equal(resource.href(), '#another/href', 'href updated via href');
		equal(resource.url(), '/another/href', 'url updated via href');
		resource.href(undefined);
		equal(resource.href(), undefined, 'href blanked via href');
		equal(resource.url(), undefined, 'url blanked via href');
		resource.url('/a/url');
		equal(resource.href(), '#a/url', 'href updated via url');
		equal(resource.url(), '/a/url', 'url updated via url');
		resource.url(undefined);
		equal(resource.href(), undefined, 'href blanked via url');
		equal(resource.url(), undefined, 'url blanked via url');
		//create resource via url string
		resource = app.resource('/a/url');
		equal(resource.href(), '#a/url', 'href parsed from a url');
		equal(resource.url(), '/a/url', 'url parsed from a url');
		resource.href('#an/href');
		equal(resource.href(), '#an/href', 'href updated via href');
		equal(resource.url(), '/an/href', 'url updated via href');
		resource.href(undefined);
		equal(resource.href(), undefined, 'href blanked via href');
		equal(resource.url(), undefined, 'url blanked via href');
		resource.url('/another/url');
		equal(resource.href(), '#another/url', 'href updated via url');
		equal(resource.url(), '/another/url', 'url updated via url');
		resource.url(undefined);
		equal(resource.href(), undefined, 'href blanked via url');
		equal(resource.url(), undefined, 'url blanked via url');
		//create resource via undefined
		resource = app.resource(undefined);
		equal(resource.href(), undefined, 'href parsed from undefined');
		equal(resource.url(), undefined, 'url parsed from undefined');
		resource.href('#an/href');
		equal(resource.href(), '#an/href', 'href updated via href');
		equal(resource.url(), '/an/href', 'url updated via href');
		resource.href(undefined);
		equal(resource.href(), undefined, 'href blanked via href');
		equal(resource.url(), undefined, 'url blanked via href');
		resource.url('/a/url');
		equal(resource.href(), '#a/url', 'href updated via url');
		equal(resource.url(), '/a/url', 'url updated via url');
		resource.url(undefined);
		equal(resource.href(), undefined, 'href blanked via url');
		equal(resource.url(), undefined, 'url blanked via url');
		//active
		resource.url('/a/url');
		app.location('#a');
		equal(resource.active(), false, 'href is more specific than current location');
		app.location('#a/url');
		equal(resource.active(), true, 'href is the same as current location');
		app.location('#a/url/link');
		equal(resource.active(), true, 'href is less specific than current location');
		app.location('#a/urls');
		equal(resource.active(), false, 'href is a substring of current location but not related');
	});

	test('eventBus', function () {
		var stats;
		var expectedPayload;
		var badEvent = 'dud';
		var event1 = 'event1';
		var event2 = 'event2';
		//fire event with no listeners
		app.eventBus.fire(event1);
		//fire events with 1 listener
		var listener1 = function (event, payload) {
			equal(payload, expectedPayload, 'checking payload');
			stats.listener1++;
		};
		app.eventBus.add(event1, listener1);
		stats = {
			listener1: 0
		};
		expectedPayload = undefined;
		app.eventBus.fire(badEvent);
		equal(stats.listener1, 0, 'listener was not invoked');
		app.eventBus.fire(event1);
		equal(stats.listener1, 1, 'listener was invoked');
		expectedPayload = 'hello';
		app.eventBus.fire(event1, 'hello');
		equal(stats.listener1, 2, 'listener was invoked with payload');
		//fire events with several listeners
		var listener2 = function (event, payload) {
			equal(payload, expectedPayload, 'checking payload');
			stats.listener2++;
		};
		app.eventBus.add(event1, listener2);
		var listener3 = function (event, payload) {
			equal(payload, expectedPayload, 'checking payload');
			stats.listener3++;
		};
		app.eventBus.add(event2, listener3);
		stats = {
			listener1: 0,
			listener2: 0,
			listener3: 0
		};
		expectedPayload = undefined;
		app.eventBus.fire(badEvent);
		deepEqual(stats, {listener1: 0, listener2: 0, listener3: 0}, 'no listener was invoked');
		app.eventBus.fire(event1);
		deepEqual(stats, {listener1: 1, listener2: 1, listener3: 0}, 'first 2 listeners were invoked');
		app.eventBus.fire(event2);
		deepEqual(stats, {listener1: 1, listener2: 1, listener3: 1}, 'last listener was invoked');
		expectedPayload = 'hello';
		app.eventBus.fire(event1, 'hello');
		deepEqual(stats, {listener1: 2, listener2: 2, listener3: 1}, 'first 2 listeners were invoked with payload');
		app.eventBus.fire(event2, 'hello');
		deepEqual(stats, {listener1: 2, listener2: 2, listener3: 2}, 'last listener was invoked with payload');
		//remove some listeners and fire more events
		app.eventBus.remove(event1, listener1);
		app.eventBus.remove(event2, listener3);
		stats = {
			listener1: 0,
			listener2: 0,
			listener3: 0
		};
		expectedPayload = undefined;
		app.eventBus.fire(event1);
		deepEqual(stats, {listener1: 0, listener2: 1, listener3: 0}, '2nd listener was invoked');
		app.eventBus.fire(event2);
		deepEqual(stats, {listener1: 0, listener2: 1, listener3: 0}, 'no listeners were invoked');
	});

	asyncTest('BaseModel', function () {
		var TestModel = app.bless(app.BaseModel, {
			constructor: function (resource) {
				this.supr(resource);
			},
			setData:     function (data) {
				this.data = data;
			}
		});
		var testModel = new TestModel(app.resource('/dummy/url'));

		$.mockjax({
			url:          '/dummy/util/BaseModel/200',
			type:         'GET',
			responseTime: 0,
			contentType:  'application/json',
			response:     function () {
				equal(testModel.busy(), true, 'busy flag is set');
				this.responseText = JSON.stringify({msg: 'good response'});
			}
		});
		$.mockjax({
			url:          '/dummy/util/BaseModel/401',
			type:         'GET',
			status:       401,
			statusText:   'fake error',
			responseTime: 0
		});

		var events = [];
		var listener = function (e, data) {
			events.push([e.type, data]);
		};
		app.eventBus.add('busy', listener);
		app.eventBus.add('error', listener);

		fireAjax('/dummy/util/BaseModel/200', part1);

		function fireAjax(url, func) {
			events = [];
			testModel.resource.url(url);
			testModel.refresh();
			setTimeout(func, 50);
		}

		function part1() {
			equal(testModel.busy(), false, 'busy flag is reset');
			deepEqual(testModel.data, {msg: 'good response'}, 'json data is set');
			deepEqual(events, [
				['busy', true],
				['busy', false]
			], 'checking fired events');
			fireAjax('/dummy/util/BaseModel/401', part2);
		}

		function part2() {
			equal(testModel.busy(), false, 'busy flag is reset');
			deepEqual(testModel.data, {msg: 'good response'}, 'json data is still set');
			deepEqual(events, [
				['busy', true],
				['error', {status: 401, msg: 'fake error'}],
				['busy', false]
			], 'checking fired events');
			app.eventBus.remove('busy', listener);
			app.eventBus.remove('error', listener);
			$.mockjaxClear();
			start();
		}
	});

	test('BasePage', function () {
		//constructor should preserve dom when possible
		var $root = $('<div>original content</div>').attr('id', config.dom.rootId).hide().appendTo($('body'));
		var page = new app.BasePage(undefined, '1st layout', '1st layout');
		equal($root.text(), '1st layout', 'page replace the layout');
		page = new app.BasePage(page, '1st layout', 'not really the same layout');
		equal($root.text(), '1st layout', 'page preserved existing layout');
		page = new app.BasePage(page, '2nd layout', 'a different layout');
		equal($root.text(), 'a different layout', 'page replaced the layout');
		//create a page with 1 widget
		var widgetDef = {
			Model: function (resource) {
				this.resource = resource;
				this.value = ko.observable('value 1');
			},
			name:  'test widget',
			view:  '<span data-bind="text:value"></span>'
		};
		$root.empty();
		var widget = page.createWidget(undefined, widgetDef, '/dummy/resource', $root);
		equal(widget, page.getWidget('test widget'), 'getWidget() returned our widget');
		equal(widget.model.resource, '/dummy/resource', 'resource was handed to model constructor');
		equal($root.text(), 'value 1', 'dom contains our view');
		widget.model.value('value 2');
		equal($root.text(), 'value 2', 'view is bound to model');
		//create a page reusing the old widget
		$root.empty();
		widget = page.createWidget(page, widgetDef, '/dummy/resource2', $root);
		equal(widget, page.getWidget('test widget'), 'getWidget() returned our widget');
		equal(widget.model.resource, '/dummy/resource', 'still using the same model');
		equal($root.text(), 'value 2', 'dom contains our view');
		widget.model.value('value 3');
		equal($root.text(), 'value 3', 'view is bound to model');
		//create a page with a different widget
		widgetDef.name = 'test widget 2';
		$root.empty();
		widget = page.createWidget(page, widgetDef, '/dummy/resource2', $root);
		equal(widget, page.getWidget('test widget 2'), 'getWidget() returned our widget');
		equal(widget.model.resource, '/dummy/resource2', 'page created new widget');
		equal($root.text(), 'value 1', 'dom contains our view');
		widget.model.value('value 4');
		equal($root.text(), 'value 4', 'view is bound to model');
		$root.remove();
	});
});