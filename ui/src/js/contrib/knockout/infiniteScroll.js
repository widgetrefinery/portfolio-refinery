define([
	'jquery',
	'knockout',
	'jquery.visible'
], function ($, ko) {

	var InfiniteScroll = function ($elem, fetchData, model) {
		this.__$elem = $elem;
		this.__fetchData = fetchData;
		this.__model = model;
		this.busy(false);
		this.error(false);
	};
	InfiniteScroll.prototype.busy = function (busy) {
		if (arguments.length) {
			if (busy) {
				this.__$elem.addClass('busy');
			} else {
				this.__$elem.removeClass('busy');
			}
		}
		return this.__$elem.hasClass('busy');
	};
	InfiniteScroll.prototype.error = function (error) {
		if (arguments.length) {
			if (error) {
				this.__$elem.addClass('error');
			} else {
				this.__$elem.removeClass('error');
			}
		}
		return this.__$elem.hasClass('error');
	};
	InfiniteScroll.prototype.enable = function (enable) {
		if (arguments.length) {
			if (enable) {
				this.__$elem.show();
			} else {
				this.__$elem.hide();
			}
		}
	};
	InfiniteScroll.prototype.fetchData = function () {
		if (!this.busy() && !this.error() && this.__$elem.visible().length) {
			this.busy(true);
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
			tgt.enable(value.enable());
		},
		update: function (elem, value) {
			value = value();
			tgt.busy(false);
			tgt.error(value.error());
			tgt.enable(value.enable());
			tgt.fetchData();
		}
	};

});