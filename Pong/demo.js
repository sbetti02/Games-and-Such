
	var keysDown = {};
	var RIGHT_KEY = 39;
	var LEFT_KEY = 37;
	var A_KEY = 65;
	var D_KEY = 68;
	var score1 = 0;
	var score2 = 0;
	var resetgame;
	var clickbutton = 0;

	$(document).ready(function() {
// TODO:
	// fix reset button
	// Make an AI for 1 player mode
	// Allow to pick paddle/ball color
	// Allow player to select keys to play with?
	// Make a cooler background design?

		$('.gameplay').hide();
		$('.info_pages').hide();
		$('.settings').hide();
		$('.level').hide();

		$('#instructions').click(function() {
			$('#how_to').show();
			$('#back').show();
			$('.start_screen').hide();
		})

		$('#credits').click(function() {
			$('#my_creds').show();
			$('#back').show();
			$('.start_screen').hide();
		})

		$('#back').click(function() {
			$('.info_pages').hide();
			$('.settings').hide();
			$('.level').hide();
			$('.start_screen').show();
		})

		$('#settings').click(function() {
			$('.start_screen').hide();
			$('.settings').show();
			$('#back').show();
			if (single_player) {$('.level').show();}
		})
		single_player = true;
		$('#play1').click(function() {
			single_player = true;
			$(this).css("background", "red");
			$('#play2').css("background", "grey");
			$('.level').show();
		})
		$('#play2').click(function() {
			single_player = false;
			$(this).css("background", "red");
			$('#play1').css("background", "grey");
			$('.level').hide();
		})
		var paddle_speed = 4;
		$('#easy').click(function() {
			paddle_speed = 4;
			$(this).css("background", "turquoise");
			$('#medium').css("background", "grey");
			$('#hard').css("background", "grey");
		})
		$('#medium').click(function() {
			paddle_speed = 7;
			$(this).css("background", "green");
			$('#easy').css("background", "grey");
			$('#hard').css("background", "grey");
		})
		$('#hard').click(function() {
			paddle_speed = 10;
			$(this).css("background", "red");
			$('#easy').css("background", "grey");
			$('#medium').css("background", "grey");
		})
		$('#play').click(function() {
			$('.start_screen').hide();
			$('.gameplay').show();
			var counter = 3;
			function timer () {
									//console.log($('#ball').offset());
									//console.log("U");		
				$('#countdown').show();		

				countInterval = setInterval(function() {
				//console.log("YO" + counter);
				//console.log($('#ball').offset());	
				var start_height = $(window).height()*.48;
				var mid_width = $(window).width()/2;
				$('#ball').offset({top: start_height, left: mid_width});			

				counter--; 				
				if (counter < 0) {counter = 3; return;}
				if (counter == 0) {
					$('#countdown').empty().append(3).hide(); 
					resetgame = 0;
					//go();
					counter = 3;
					clearInterval(countInterval);
					//countInterval = 0;
					go();
					//return;
				} 
				$('#countdown').empty().append(counter); 
			}, 1000)};

			timer();
		})


		function go() {


					//console.log($('#ball').offset());				


			var screenwidth = $(window).width() - $('#paddle').width();
			var ball_y = $('#ball').position().top;
			var ball_x =  $('#ball').position().left;
			var x_movement;
			var y_movement;
			// stay pressed
			$('html').keyup(function(e){
				keysDown[e.which] = false;
			})

			$('html').keydown(function (e) {
				keysDown[e.which] = true;
			})
				

			function animate(moveleft, movedown, x_speed, y_speed) {

				x_movement = moveleft? "-="+x_speed : "+="+x_speed;
				y_movement = movedown? "+="+y_speed : "-="+y_speed;
				if (!single_player) {
					if (keysDown[65]) { // letter 'a'
						if (0 < $('#paddle2').position().left) {
							$('#paddle2').animate({
								'left': '-=7'}, 5 // move left
							);
						}
					}
					if (keysDown[68]) { // letter 'd'
						if (screenwidth > $('#paddle2').position().left) {
							$('#paddle2').animate({
								'left': '+=7'}, 5 // move right
							);
						}
					}
				}
				if (single_player) {
					if (Math.abs(ball_x - ($('#paddle2').position().left + ($('#paddle2').width()/2))) >= 7) {
						if (ball_x < $('#paddle2').position().left + ($('#paddle2').width()/2)) {
							$('#paddle2').animate({
								'left': '-='+paddle_speed}, 2
							);
						}
						if (ball_x > $('#paddle2').position().left + ($('#paddle2').width()/2)) {
							$('#paddle2').animate({
								'left': '+='+paddle_speed}, 2
							);
						}
					} else {
						if (ball_x < $('#paddle2').position().left + ($('#paddle2').width()/2)) {
							$('#paddle2').animate({
								'left': '-=1'}, 2
							);
						}
						if (ball_x > $('#paddle2').position().left + ($('#paddle2').width()/2)) {
							$('#paddle2').animate({
								'left': '+=1'}, 2
							);
						}
					}
				}
				if (keysDown[37]) { // left arrow
					if (0 < $('#paddle').position().left) {
						$('#paddle').animate({
							'left': '-=7'}, 5 // move left
						);
					}
				}
				if (keysDown[39]) { // right arrow
					if (screenwidth > $('#paddle').position().left) {
						$('#paddle').animate({
							'left': '+=7'}, 5 // move right
						);
					}
				}
				$('#ball').animate({ // animate the ball movement
						
					'left': x_movement, 'top': y_movement}, 13, "swing",function(){
						ball_y = $('#ball').position().top;
						ball_x =  $('#ball').position().left;
						var ball_width = $('#ball').width();
						var paddlePos = $('#paddle').position();
						var paddlePos2 = $('#paddle2').position();
						var paddleWidth2 = $('#paddle2').width();
						var paddleHeight2 = $('#paddle2').height();				
						var paddleWidth = $('#paddle').width();
						var paddleHeight= $('#paddle').height();

						if (ball_x < 0 || ($(window).width()- $('#ball').width()) < ball_x){
							moveleft = !moveleft; // flip the ball movement if hits wall
						}
						if (ball_y < 0 || ($(window).height()- $('#ball').height()) < ball_y){
							if (ball_y < 0) {
								score2++;
							}
							else {
								score1++;
							}
							$('#p1Score').empty().append(score1);
							$('#p2Score').empty().append(score2);
							if (score1 < 10 && score2 < 10) {
								resetting();
							}
							else {
								var winner;
								if (score2 == 10) {
									winner = 1;
								}
								else {
									winner = 2;
								}
								$('#gameover').append("PLAYER " + winner + " WINS!");
							}
							return; // end sequence if hits top or bottom
						}					

						var impact_location;

						if ( (ball_y > paddlePos.top - 1.5*paddleHeight) && (ball_y < paddlePos.top) && (ball_x >  (paddlePos.left - ball_width)) && 
							(ball_x < paddlePos.left + paddleWidth)){
							impact_location = ball_x - paddlePos.left;
							console.log("impact location = " + impact_location);
							pct_paddle_hit = impact_location/paddleWidth;
							console.log("pct paddle hit = " +  pct_paddle_hit);
							if (pct_paddle_hit > 0.5) {
								x_speed = (pct_paddle_hit-0.5)*13;
								moveleft = false;
							}
							else {
								x_speed = (0.5-pct_paddle_hit)*13;
								moveleft = true;
							}
							movedown = false; // if hits paddle on bottom, send upwards
						}
						if ( (ball_y < paddlePos2.top + paddleHeight2) && (ball_y > paddlePos2.top) && (ball_x >  (paddlePos2.left - ball_width)) && 
							(ball_x < paddlePos2.left + paddleWidth2)){
							impact_location = ball_x - paddlePos2.left;
							console.log("impact2 location = " + impact_location);
							pct_paddle_hit = impact_location/paddleWidth2;
							console.log("pct paddle hit = " + pct_paddle_hit);
							if (pct_paddle_hit > 0.5) {
								x_speed = (pct_paddle_hit-0.5)*13;
								moveleft = false;
							}
							else {
								x_speed = (0.5-pct_paddle_hit)*13;
								moveleft = true;
							}
							movedown = true; // if hits top paddle, send downwards
						}
						//console.log(resetgame);
						if (resetgame == 1) {console.log("here"); return;}
						animate(moveleft,movedown, x_speed, y_speed); // call recursively
						//console.log("x movement = " + x_movement);
						//console.log("y movement = " + y_movement);

					}
				);

			}
			var startup;
			var startleft;
			function startpos() {
				if (Math.ceil(Math.random() * 2) == 1) {
					startup = true;
				}
				else {
					startup = false;
				}
				if (Math.ceil(Math.random() * 2) == 1) {
					startleft = true;
				}
				else {
					startleft = false;
				}
			}
			startpos();
			animate(startleft, startup, 0, 6); // call the function the first time

			function resetting() {
				//x_movement = 0;
				//y_movement = 0;
				var heightdist = $('#paddle').position().height;
				var heightdist2 = $('#paddle2').position().height;
				var pos_left = $(window).width()*.46;
				var mid_width = $(window).width()/2;
				var start_height = $(window).height()*.48;
				leftdist = $('#paddle').position().width;
				$('#paddle').offset({top: heightdist, left: pos_left});
				$('#paddle2').offset({top: heightdist2, left: pos_left});
				$('#ball').offset({top: start_height, left: mid_width}).delay(2000);
				//console.log("Im here");
				//console.log($('#ball').offset());
				if (resetgame == 0) {
					startpos();
					animate(startleft, startup, 0, 6);
				}
			}


			clickbutton = 0;
			$('#reset_button').click(function() { // TODO: make this call reset correctly, not just restart the page
				//location.reload();
				//reset();
				clickbutton++;
				if (clickbutton > 1) {return;}					
				console.log("clicked " + clickbutton + " time(s)");
				console.log("asdf");
				resetgame = 1;
				//p1Score = 0;
				//p2Score = 0;
				resetting();
				console.log($('#ball').offset());		
				timer();
			})
		}

		

	})