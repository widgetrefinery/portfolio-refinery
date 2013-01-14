require([
	'jquery',
	'jquery.visible'
], function ($) {

	module('contrib/jquery');

	test('jquery.visible', function () {
		//setup
		var $body = $('body');
		var $window = $(window);
		var html = '<div style="left:0; position:fixed; top:0;">';
		var $root = $('<div>' + html + '1</div>' + html + '2</div>' + html + '3</div></div>').appendTo($body);
		var $elems = $root.find('div');
		var $elem0 = $root.find('div:eq(0)');
		var $elem1 = $root.find('div:eq(1)');
		var $elem2 = $root.find('div:eq(2)');
		//tests
		equal($elems.visible().text(), '123', 'normal DIVs');

		$elem0.hide(); //within the browser window but hidden via css
		$elem1.css('top', -$elem1.height()); //moved off screen above window
		$elem2.css('top', 1 - $elem2.height()); //visible by 1 pixel at top of window
		equal($elems.visible().text(), '3', 'only 3rd DIV is visible');

		$elem0.show().css('top', $window.scrollTop() + $window.height() - 1); //visible by 1 pixel at bottom of window
		$elem1.css('top', $window.scrollTop() + $window.height()); //moved off screen below window
		$elem2.css('top', 0).css('left', -$elem2.width()); //moved off screen to the left
		equal($elems.visible().text(), '1', 'only 1st DIV is visible');

		$elem0.css('top', 0).css('left', 1 - $elem0.width()); //visible by 1 pixel to the left
		$elem1.css('top', 0).css('left', $window.scrollLeft() + $window.width() - 1); //visible by 1 pixel to the right
		$elem2.css('left', $window.scrollLeft() + $window.width()); //moved off screen to the right
		equal($elems.visible().text(), '12', '1st and 2nd DIVs is visible');
		//cleanup
		$root.remove();
	});

});