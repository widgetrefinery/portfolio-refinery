require([
	'util/common'
], function (common) {

	module('util/common');

	test('bless', function () {
		var Parent = common.bless('Parent', {
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
		var Child = common.bless(Parent, 'Child', {
			constructor: function (value) {
				this._super(value + ' - Child');
			},
			getValue:    function (callParent) {
				if (callParent) {
					return this._super();
				} else {
					return '[Child] ' + this.value;
				}
			}
		});
		var Grandchild = common.bless(Child, 'Grandchild', {
			constructor: function (value) {
				this._super(value + ' - Grandchild');
			},
			getValue:    function (callParent) {
				if (callParent) {
					return this._super(callParent);
				} else {
					return '[Grandchild] ' + this.value;
				}
			}
		});

		var parent = new Parent('val1');
		var child = new Child('val2');
		var grandchild = new Grandchild('val3');
		equal(Parent._name, 'Parent', 'access classname via class');
		equal(parent.constructor._name, 'Parent', 'access classname via instance');
		equal(parent.check(), '[Parent] val1 - Parent', 'Parent is properly initialized');
		equal(child.check(), '[Parent] val2 - Child - Parent', 'Child is properly initialized');
		equal(grandchild.check(), '[Parent] val3 - Grandchild - Child - Parent', 'Grandchild is properly initialized');
		equal(child.getValue(), '[Child] val2 - Child - Parent', 'Child overwrote Parent.getValue()');
		equal(child.getValue(true), '[Parent] val2 - Child - Parent', 'Child called Parent.getValue()');
		equal(grandchild.getValue(), '[Grandchild] val3 - Grandchild - Child - Parent', 'Grandchild overwrote Parent.getValue()');
		equal(grandchild.getValue(true), '[Parent] val3 - Grandchild - Child - Parent', 'Grandchild called Parent.getValue()');

		var Child2 = common.bless(Parent, 'Child2', {
			getValue: function () {
				return '[Child2] ' + this.value;
			}
		});
		var child2 = new Child2('val4');
		equal(child2.check(), '[Parent] val4 - Parent', 'Child2 is property initialized');
		equal(child2.getValue(), '[Child2] val4 - Parent', 'Child2 overwrote Parent.getValue()');

		var Single = common.bless('Single', {
			check: function () {
				return 'Single';
			}
		});
		var single = new Single();
		equal(single.check(), 'Single', 'Single is properly initialized');
	});

});