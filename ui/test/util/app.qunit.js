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

	test('BaseModel.sync', function () {
		var TestModel = common.bless(app.BaseModel, 'TestModel', {
			constructor: function () {
				this._super({uri: '/parent/child', parentDepth: -1});
				this.value = ko.observable();
			}
		});
		var testModel = new TestModel();
		var $root = $('<div data-bind="text:value"></div>').hide().appendTo($('body'));
		testModel.bind($root);
		equal($root.text(), '', 'checking initial view');
		testModel.value('new value');
		equal($root.text(), 'new value', 'model automatically updated view');
		URI.current('#dummy/url');
		testModel.cancel();
		equal(URI.current(), '#parent', 'current uri is updated');
		$root.remove();
	});

	asyncTest('BaseModel.async', function () {
		var TestModel = common.bless(app.BaseModel, 'TestModel', {
			getData: function () {
				return this.data;
			},
			setData: function (data) {
				this.data = data;
			}
		});
		var testModel = new TestModel({uri: '/dummy/url', existing: false, parentDepth: -1});

		var goodUrl = '/dummy/util/BaseModel/200';
		var newUrl = '/dummy/util/BaseModel/302';
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
			url:          newUrl,
			data:         JSON.stringify({msg: 'new data'}),
			type:         'POST',
			headers:      {
				Location: '/real/url'
			},
			status:       302,
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
		var ajaxTimeout = 50;

		var events = [];
		var listener = function (e, data) {
			events.push([e.type, data]);
		};
		app.eventBus.add('busy', listener);
		app.eventBus.add('error', listener);

		var testCases = [
			{url: newUrl, op: 'save', data: {msg: 'new data'}, current: '#real', error: false, newUrl: '/real/url'},
			{url: goodUrl, op: 'refresh', data: {msg: 'good response'}, current: '#parent/child', error: false},
			{url: badUrl, op: 'refresh', data: {msg: 'new data'}, current: '#parent/child', error: true},
			{url: goodUrl, op: 'save', data: {msg: 'new data'}, current: '#dummy/util/BaseModel', error: false},
			{url: badUrl, op: 'save', data: {msg: 'new data'}, current: '#parent/child', error: true},
			{url: goodUrl, op: 'del', data: {msg: 'new data'}, current: '#dummy/util/BaseModel', error: false},
			{url: badUrl, op: 'del', data: {msg: 'new data'}, current: '#parent/child', error: true}
		];
		setup();

		function setup() {
			events = [];
			testModel.uri.url(testCases[0].url);
			testModel.data = {msg: 'new data'};
			URI.current('#parent/child');
			testModel[testCases[0].op]();
			setTimeout(check, ajaxTimeout);
		}

		function check() {
			equal(testModel.existing(), true, 'existing flag is set after ' + testCases[0].op);
			if (testCases[0].newUrl) {
				equal(testModel.uri.url(), testCases[0].newUrl, 'url is set after ' + testCases[0].op);
			}
			equal(testModel.busy(), false, 'busy flag is reset after ' + testCases[0].op);
			deepEqual(testModel.data, testCases[0].data, 'json data is set after ' + testCases[0].op);
			equal(URI.current(), testCases[0].current, 'current uri is updated');
			if (testCases[0].error) {
				deepEqual(events[0], ['busy', true], 'checking fired event 0');
				equal(events[1][0], 'error', 'checking fired event 1');
				equal(events[1][1].obj, testModel, 'checking model');
				equal(events[1][1].response.status, 401, 'checking response status');
				equal(events[1][1].response.statusText, 'fake error', 'checking response text');
				equal(events[1][1].src, testCases[0].op, 'checking error source');
				deepEqual(events[2], ['busy', false], 'checking fired event 2');
			} else {
				deepEqual(events, [
					['busy', true],
					['busy', false]
				], 'checking fired events');
			}
			testCases.shift();
			if (testCases.length) {
				setup();
			} else {
				app.eventBus.remove('busy');
				app.eventBus.remove('error');
				$.mockjaxClear();
				start();
			}
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
		var TestModel = function (args) {
			this.args = args;
		};
		TestModel._name = 'testModel1';
		equal(page._hasModel(TestModel), false, 'page does not know about model');
		var model = page._addModel(undefined, TestModel, {uri: '/dummy/uri', existing: true});
		equal(page._hasModel(TestModel), true, 'page knows about model');
		equal(page.__models['testModel1'], model, 'page has cached our model');
		deepEqual(model.args, {uri: '/dummy/uri', existing: true}, 'model args passed to constructor');
		//create the same model
		model = page._addModel(page, TestModel, {uri: '/dummy/uri2', existing: false});
		deepEqual(model.args, {uri: '/dummy/uri', existing: true}, 'reused existing model');
		//create a different model
		TestModel._name = 'testModel2';
		model = page._addModel(page, TestModel, {uri: '/dummy/uri2', existing: false});
		deepEqual(model.args, {uri: '/dummy/uri2', existing: false}, 'new model created');
		$root.remove();
	});

});