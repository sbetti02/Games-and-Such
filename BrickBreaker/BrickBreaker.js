$(document).ready(function() {
	var rects = [];
	window_height = $(window).height();
	var rect_num = 0;
	for (i = 1; i < 12; i++) {
		for (j = 0; j < 4; j++) {
			space_down = (window_height*.1) + (j*50);
			space_left = i*8;
			$('<div/>', {
				'id':'rect' + rect_num,
				'class':'rects'
			}).appendTo('body');
			$('#rect'+rect_num).css("left", space_left+'%');
			$('#rect'+rect_num).css("top", space_down+'px');
			rects.push($('#rect'+rect_num).position());
			rect_num++;
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
				var ball_pos = $('#ball').position();
				var paddle_pos = $('#paddle').position();
				if ((ball_pos.top > (paddle_pos.top - 1.5*$('#paddle').height()) && 
					ball_pos.left > paddle_pos.left && 
					ball_pos.left < (paddle_pos.left + $('#paddle').width()))) {
					movedown = false;
					var impact_location = ball_pos.left-paddle_pos.left;
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
				if (ball_pos.top < 0) {
					movedown = true;
				}
				if (ball_pos.left < 0) {
					moveleft = false;
				}
				if (ball_pos.left > $(window).width() - $('#ball').width()) {
					moveleft = true;
				}
				for (k=0; k<rects.length; k++) {
					if (((ball_pos.left+$('#ball').width()) > rects[k].left) && 
						ball_pos.left < (rects[k].left + $('#rect0').width()) &&
						(ball_pos.top < rects[k].top+$('#rect0').height()) &&
						(ball_pos.top > rects[k].top))
					{
						if ($('#rect'+k).css('display') != 'none' ){
							movedown=true;
							$('#rect'+k).hide();
						}
					}
					if (((ball_pos.left+$('#ball').width()) > rects[k].left) && 
						ball_pos.left < (rects[k].left + $('#rect0').width()) &&
						(ball_pos.top > rects[k].top-5) &&
						(ball_pos.top < rects[k].top))
					{
						if ($('#rect'+k).css('display') != 'none' ){
							movedown=false;
							$('#rect'+k).hide();
						}
					}
					if ((ball_pos.top > rects[k].top) &&
						ball_pos.top < rects[k].top-$('#rect0').height() &&
						ball_pos.left < rects[k].left+5 &&
						ball_pos.left > rects[k].left )  
					{
						if ($('#rect'+k).css('display') != 'none') {
							moveleft = true;
							$('#rect'+k).hide();
						}
					}
				}
				if (ball_pos.top > ($(window).height()-$('#ball').height())) {
					return;
				}
				animate(movedown, moveleft, x_speed);
			}
		);
	}
	animate(true,true,0);
})