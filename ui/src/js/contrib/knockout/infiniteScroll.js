define([
	'jquery',
	'knockout',
	'jquery.visible'
], function ($, ko) {

	var states = {
		BUSY:     'busy',
		DISABLED: 'disabled',
		ERROR:    'error',
		READY:    'ready'
	};

	var InfiniteScroll = function ($elem, fetchData, model) {
		this.__$elem = $elem;
		this.__fetchData = fetchData;
		this.__model = model;
		this.state(states.DISABLED);
	};
	InfiniteScroll.prototype.state = function (state) {
		if (arguments.length && this.__state != state) {
			this.__state = state;
			if (states.BUSY == state) {
				this.__$elem.addClass('busy');
			} else {
				this.__$elem.removeClass('busy');
			}
			if (states.ERROR == state) {
				this.__$elem.addClass('error');
			} else {
				this.__$elem.removeClass('error');
			}
			if (states.DISABLED == state) {
				this.__$elem.hide();
			} else {
				this.__$elem.show();
			}
		}
		return this.__state;
	};
	InfiniteScroll.prototype.fetchData = function () {
		if (states.READY == this.state() && this.__$elem.visible().length) {
			this.state(states.BUSY);
			this.__fetchData.call(this.__model);
		}
	};

	var tgt;
	var windowHandler = function () {
		if (tgt) {
			tgt.fetchData();
		}
	};
	$(window).resize(windowHandler).scroll(windowHandler);

	ko.bindingHandlers.infiniteScroll = {
		init:   function (elem, value, allBindings, model) {
			var $elem = $(elem);
			value = value();
			tgt = new InfiniteScroll($elem, value.callback, model);
			$elem.click(function () {
				if (states.ERROR == tgt.state()) {
					tgt.state(states.READY);
				}
				tgt.fetchData();
			});
		},
		update: function (elem, value) {
			tgt.state(value().state());
			tgt.fetchData();
		}
	};

	return states;

});