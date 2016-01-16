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
	var left_pressed = false;
	var right_pressed = false;
	$('html').keydown(function (e) { // stay pressed
		if (e.which == 37) {
			left_pressed = true;

		}
		if (e.which == 39) {
			right_pressed = true;
		}
		if (left_pressed && right_pressed) { // make more fluid, go in new direction pressed
			left_pressed = false;
		}
	})
	$('html').keyup(function(e) {
		if (e.which == 37) {
			left_pressed = false;
		}
		if (e.which == 39) {
			right_pressed = false;
		}
	})

	function animate(movedown, moveleft, x_vel) {
		var y_speed;
		var x_movement;
		var x_speed = x_vel;
		if (moveleft) {
			x_movement = "-="+x_vel;
		}
		else {
			x_movement = "+="+x_vel;
		}
		if (movedown) {
			y_speed = "+=5";
		} 
		else {
			y_speed = "-=5";
		}
		if (left_pressed) {
			if (0 < $('#paddle').position().left) {
				$('#paddle').animate({
					'left': '-=5'}, 5
				);
			}
		}
		if (right_pressed) {
			if (($(window).width()-$('#paddle').width()) > $('#paddle').position().left) {
				$('#paddle').animate({
					'left': '+=5'}, 5
				);
			}
		}

		$('#ball').animate({
			'top': y_speed, 'left': x_movement}, 5, "swing", function() {
				if (($('#ball').position().top > ($('#paddle').position().top - 1.5*$('#paddle').height()) && 
					$('#ball').position().left > $('#paddle').position().left && 
					$('#ball').position().left < ($('#paddle').position().left + $('#paddle').width()))) {
					movedown = false;
					var impact_location = $('#ball').position().left-$('#paddle').position().left;
					var pct_hit = impact_location/$('#paddle').width();
					if (pct_hit>.5) {
						x_speed = (pct_hit-.5)*10;
						moveleft = false;;
					}
					else{
						x_speed = (.5-pct_hit)*10;
						moveleft = true;
					}
				}
				if ($('#ball').position().top < 0) {
					movedown = true;
				}
				if ($('#ball').position().left < 0) {
					moveleft = false;
				}
				if ($('#ball').position().left > $(window).width() - $('#ball').width()) {
					moveleft = true;
				}
				if ($('#ball').position().top > ($(window).height()-$('#ball').height())) {
					return;
				}
				animate(movedown, moveleft, x_speed);
			}
		);
	}
	animate(true,true,0);


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