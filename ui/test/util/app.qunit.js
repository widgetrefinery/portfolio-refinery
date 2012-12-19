require(['util/app'], function (app) {
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

		var parent = new Parent('val1');
		var child = new Child('val2');
		var grandchild = new Grandchild('val3');
		equal(parent.check(), '[Parent] val1 - Parent', 'Parent is properly initialized');
		equal(child.check(), '[Parent] val2 - Child - Parent', 'Child is properly initialized');
		equal(grandchild.check(), '[Parent] val3 - Grandchild - Child - Parent', 'Grandchild is properly initialized');
		equal(child.getValue(), '[Child] val2 - Child - Parent', 'Child overrode getValue()');
		equal(child.getValue(true), '[Parent] val2 - Child - Parent', 'Child called Parent.getValue()');
		equal(grandchild.getValue(), '[Grandchild] val3 - Grandchild - Child - Parent', 'Grandchild overrode getValue()');
		equal(grandchild.getValue(true), '[Parent] val3 - Grandchild - Child - Parent', 'Grandchild called Parent.getValue()');
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
});