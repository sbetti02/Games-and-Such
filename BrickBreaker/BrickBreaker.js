$(document).ready(function() {
	//var rect = {};
	//rect = $('#rect');
	//rects = [];
	//rects.push(rect);
	window_height = $(window).height();
	for (i = 1; i < 12; i++) {
		for (j = 0; j < 4; j++) {
			space_down = (window_height*.1) + (j*50);
			space_left = i*8;
			$('<div/>', {
				'id':'rect' + i + j,
				'class':'rects'
			}).appendTo('body');
			$('#rect'+i+j).css("left", space_left+'%');
			$('#rect'+i+j).css("top", space_down+'px');
		}
	}

	$('html').keydown(function (e) { // stay pressed
		if (e.which == 37) {
			if (0 < $('#paddle').position().left) {
				$('#paddle').animate({
					'left': '-=30'}, 5
				);
			}
		}
		if (e.which == 39) {
			if (($(window).width()-$('#paddle').width()) > $('#paddle').position().left) {
				$('#paddle').animate({
					'left': '+=30'}, 5
				);
			}
		}
	})

	
	/*console.log(rect.css("left"));
	rect2 = $('#rect2');
	rect2.css("left", "60%");
	console.log(rect.css("left"));
	rects.push(rect2); 
	$('<div/>', {
	    'id':'rect2',
	    'class':'rects',
	})*/
})