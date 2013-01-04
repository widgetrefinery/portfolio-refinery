require([
	'jquery',
	'model/header',
	'util/uri',
	'text!view/header.html'
], function ($, Header, URI, html) {

	module('view/header');

	test('binding', function () {
		var $html = $(html).hide().appendTo($('body'));
		var model = new Header();
		model.bind($html);
		equal($html.find('li').length, model.entries.length, 'entry list');
		equal($html.find('li:eq(0) a').text(), model.entries[0].name, 'entry 0 name');
		equal($html.find('li:eq(0) a').attr('href'), model.entries[0].uri.href(), 'entry 0 href');
		URI.current('');
		equal($html.find('.active').length, 0, 'no active entries');
		URI.current(model.entries[0].uri.href());
		equal($html.find('.active').length, 1, '1 active entry');
		equal($html.find('.active a').text(), model.entries[0].name, 'entry 0 is active');
		URI.current(model.entries[1].uri.href() + '/subsection');
		equal($html.find('.active').length, 1, '1 active entry');
		equal($html.find('.active a').text(), model.entries[1].name, 'entry 1 is active');
		$html.remove();
	});

});