(function ($) {

	var $window = $(window);

	$.fn.visible = function () {
		return this.filter(function () {
			var $this = $(this);
			if ($this.is(':hidden')) {
				return false;
			}
			var wt = $window.scrollTop();
			var wb = $window.height() + wt;
			var wl = $window.scrollLeft();
			var wr = $window.width() + wl;
			var et = $this.offset().top;
			var eb = $this.height() + et;
			var el = $this.offset().left;
			var er = $this.width() + el;
			return wt < eb && wb > et && wl < er && wr > el;
		});
	};

})(jQuery);