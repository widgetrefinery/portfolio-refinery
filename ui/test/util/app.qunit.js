require([
	'jquery',
	'knockout',
	'util/app',
	'util/common',
	'util/config',
	'util/uri',
	'jquery.mockjax'
], function ($, ko, app, common, config, URI) {

	module('util/app');

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
		//clear all listeners
		app.eventBus.remove(event1);
		app.eventBus.fire(event1);
		deepEqual(stats, {listener1: 0, listener2: 1, listener3: 0}, 'no listener was invoked');
	});

	test('BaseModel', function () {
		var TestModel = common.bless(app.BaseModel, 'TestModel', {
			constructor: function () {
				this.value = ko.observable();
			}
		});
		var testModel = new TestModel();
		var $root = $('<div data-bind="text:value"></div>').hide().appendTo($('body'));
		testModel.bind($root);
		equal($root.text(), '', 'checking initial view');
		testModel.value('new value');
		equal($root.text(), 'new value', 'model automatically updated view');
		$root.remove();
	});

	asyncTest('BaseModel.crud', function () {
		var TestModel = common.bless(app.BaseModel, 'TestModel', {
			getData: function () {
				return this.data;
			},
			setData: function (data) {
				this.data = data;
			}
		});
		var testModel = new TestModel('/dummy/url', true);

		var goodUrl = '/dummy/util/BaseModel/200';
		var badUrl = '/dummy/util/BaseModel/401';
		$.mockjax({
			url:          goodUrl,
			type:         'GET',
			responseTime: 0,
			contentType:  'application/json',
			response:     function () {
				equal(testModel.busy(), true, 'busy flag is set');
				this.responseText = JSON.stringify({msg: 'good response'});
			}
		});
		$.mockjax({
			url:          goodUrl,
			data:         JSON.stringify({msg: 'new data'}),
			type:         'POST',
			status:       204,
			responseTime: 0
		});
		$.mockjax({
			url:          goodUrl,
			type:         'DELETE',
			status:       204,
			responseTime: 0
		});
		$.each(['GET', 'POST', 'DELETE'], function (ndx, type) {
			$.mockjax({
				url:          badUrl,
				type:         type,
				status:       401,
				statusText:   'fake error',
				responseTime: 0
			});
		});

		var events = [];
		var listener = function (e, data) {
			events.push([e.type, data]);
		};
		app.eventBus.add('busy', listener);
		app.eventBus.add('error', listener);

		setupAndCheck(goodUrl, 'refresh', part1);

		function setupAndCheck(url, op, check) {
			events = [];
			testModel.uri.url(url);
			testModel.data = {msg: 'new data'};
			URI.current('#parent/child');
			testModel[op]();
			setTimeout(check, 50);
		}

		function part1() {
			equal(testModel.busy(), false, 'busy flag is reset');
			deepEqual(testModel.data, {msg: 'good response'}, 'json data is set');
			deepEqual(events, [
				['busy', true],
				['busy', false]
			], 'checking fired events');
			setupAndCheck(badUrl, 'refresh', part2);
		}

		function part2() {
			equal(testModel.busy(), false, 'busy flag is reset');
			deepEqual(testModel.data, {msg: 'new data'}, 'json data did not change');
			deepEqual(events[0], ['busy', true], 'checking fired event 0');
			equal(events[1][0], 'error', 'checking fired event 1');
			equal(events[1][1].response.status, 401, 'checking fired event 1');
			equal(events[1][1].response.statusText, 'fake error', 'checking fired event 1');
			deepEqual(events[2], ['busy', false], 'checking fired event 2');
			setupAndCheck(goodUrl, 'save', part3);
		}

		function part3() {
			equal(testModel.busy(), false, 'busy flag is reset');
			equal(URI.current(), '#parent', 'location updated');
			deepEqual(events, [
				['busy', true],
				['busy', false]
			], 'checking fired events');
			setupAndCheck(badUrl, 'save', part4);
		}

		function part4() {
			equal(testModel.busy(), false, 'busy flag is reset');
			equal(URI.current(), '#parent/child', 'location unchanged');
			deepEqual(events[0], ['busy', true], 'checking fired event 0');
			equal(events[1][0], 'error', 'checking fired event 1');
			equal(events[1][1].response.status, 401, 'checking fired event 1');
			equal(events[1][1].response.statusText, 'fake error', 'checking fired event 1');
			deepEqual(events[2], ['busy', false], 'checking fired event 2');
			setupAndCheck(goodUrl, 'del', part5);
		}

		function part5() {
			equal(testModel.busy(), false, 'busy flag is reset');
			equal(URI.current(), '#parent', 'location updated');
			deepEqual(events, [
				['busy', true],
				['busy', false]
			], 'checking fired events');
			setupAndCheck(badUrl, 'del', part6);
		}

		function part6() {
			equal(testModel.busy(), false, 'busy flag is reset');
			equal(URI.current(), '#parent/child', 'location unchanged');
			deepEqual(events[0], ['busy', true], 'checking fired event 0');
			equal(events[1][0], 'error', 'checking fired event 1');
			equal(events[1][1].response.status, 401, 'checking fired event 1');
			equal(events[1][1].response.statusText, 'fake error', 'checking fired event 1');
			deepEqual(events[2], ['busy', false], 'checking fired event 2');
			app.eventBus.remove('busy');
			app.eventBus.remove('error');
			$.mockjaxClear();
			start();
		}
	});

	test('BasePage', function () {
		//test layout preservation
		var $root = $('<div>original content</div>').attr('id', config.dom.rootId).hide().appendTo($('body'));
		var page = new app.BasePage(undefined, 'layout1', 'initial layout content');
		equal($root.text(), 'initial layout content', 'page replace the layout');
		page = new app.BasePage(page, 'layout1', 'not really the same layout');
		equal($root.text(), 'initial layout content', 'page preserved existing layout');
		page = new app.BasePage(page, 'layout2', 'a different layout');
		equal($root.text(), 'a different layout', 'page replaced the layout');
		//create a page with 1 model
		var TestModel = function (uri, existing) {
			this.uri = uri;
			this.existing = existing;
		};
		TestModel._name = 'testModel1';
		var model = page._addModel(undefined, TestModel, '/dummy/uri', true);
		equal(page.__models['testModel1'], model, 'page has cached our model');
		equal(model.uri, '/dummy/uri', 'uri passed to model constructor');
		equal(model.existing, true, 'existing passed to model constructor');
		//create the same model
		model = page._addModel(page, TestModel, '/dummy/uri2', false);
		equal(model.uri, '/dummy/uri', 'reused existing model');
		//create a different model
		TestModel._name = 'testModel2';
		model = page._addModel(page, TestModel, '/dummy/uri2', false);
		equal(model.uri, '/dummy/uri2', 'new model created');
		$root.remove();
	});

});