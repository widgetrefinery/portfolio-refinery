define(['knockout', 'text!view/account.html'], function (ko, html) {
	var Account = function (href) {
		this.busy = ko.observable(false);
		this.error = ko.observable();
		this.href = href;
		this.name = ko.observable();
		this.active = ko.observable();
	};
	Account.prototype.set = function (data) {
		this.href = data.href;
		this.name(data.name);
		this.active(data.active);
	};
	Account.prototype.refresh = function () {
		this.busy(true);
		var self = this;
		$.ajax(this.href, {
			complete: function () {
				self.busy(false);
			},
			error:    function (xhr, status) {
				self.error(status);
			},
			success:  function (data) {
				self.set(data);
			}
		});
	};

	return {
		model: Account,
		view:  html
	};
});