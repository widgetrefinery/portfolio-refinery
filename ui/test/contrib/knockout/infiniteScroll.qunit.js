define([
	'jquery',
	'knockout',
	'contrib/knockout/infiniteScroll'
], function ($, ko, infiniteScroll) {

	module('contrib/knockout');

	test('infiniteScroll', function () {
		//setup
		var $root = $('<div style="position:fixed;top:0;left:0" data-bind="infiniteScroll:{state:state,callback:callback}">X</div>').appendTo($('body'));
		var invoked = 0;
		var model = {
			state:   ko.observable(infiniteScroll.DISABLED),
			callback:function () {
				equal(this, model, 'ensure callback is invoked with the correct context');
				invoked++;
			}
		};
		ko.applyBindings(model, $root[0]);
		//test binding
		check(0, 'invoked 0 times after setup', false, false, false);
		model.state(infiniteScroll.READY);
		check(1, 'invoked 1 time after setting state to ready', true, true, false);
		model.state(infiniteScroll.ERROR);
		check(0, 'invoked 0 times after setting state to error', true, false, true);
		model.state(infiniteScroll.BUSY);
		check(0, 'invoked 0 times after setting state to busy', true, true, false);
		$root.css('top', '101%');
		model.state(infiniteScroll.READY);
		quickCheck(0, 'invoked 0 times after setting state to ready and moving off screen');
		$root.css('top', '50%');
		$(window).trigger('scroll');
		quickCheck(1, 'invoked 1 time after triggering scroll event');
		$(window).trigger('scroll');
		quickCheck(0, 'invoked 0 times after triggering scroll event again');
		resetState(infiniteScroll.READY);
		$(window).trigger('resize');
		quickCheck(1, 'invoked 1 time after triggering resize event');
		$(window).trigger('resize');
		quickCheck(0, 'invoked 0 times after triggering resize event again');
		resetState(infiniteScroll.READY);
		$root.trigger('click');
		quickCheck(1, 'invoked 1 time after triggering click event');
		$root.trigger('click');
		quickCheck(0, 'invoked 0 times after triggering click event again');
		resetState(infiniteScroll.ERROR);
		$root.trigger('click');
		quickCheck(1, 'invoked 1 time after triggering click event in the error state');
		resetState(infiniteScroll.BUSY);
		$root.trigger('click');
		quickCheck(0, 'invoked 0 times after triggering click event in the busy state');
		//cleanup
		$root.remove();

		function check(invokeCount, msg, visible, busy, error) {
			equal(invoked, invokeCount, msg);
			equal($root.is(':visible'), visible, 'check visibility');
			equal($root.hasClass('busy'), busy, 'check busy class');
			equal($root.hasClass('error'), error, 'check error class');
			invoked = 0;
		}

		function quickCheck(invokeCount, msg) {
			equal(invoked, invokeCount, msg);
			invoked = 0;
		}

		function resetState(state) {
			var curInvoked = invoked;
			$root.css('top', '101%');
			model.state(undefined);
			model.state(state);
			$root.css('top', '50%');
			equal(invoked, curInvoked, 'reset state to ' + state);
		}
	});

});
