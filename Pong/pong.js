
var keysDown = {};
var RIGHT_KEY = 39;
var LEFT_KEY = 37;
var A_KEY = 65;
var D_KEY = 68;
var score1 = 0;
var score2 = 0;
var resetgame;

$(document).ready(function() {
// TODO:
// Allow to pick paddle/ball color
// Allow player to select keys to play with?
// Make a cooler background design?

	var paddleWidth2 = $('#paddle2').width();
	var screenwidth = $(window).width() - $('#paddle').width();
	var ball_y = $('#ball').position().top;
	var ball_x =  $('#ball').position().left;
	var x_movement;
	var y_movement;
	var ball_width = $('#ball').width();
	var ball_height = $('#ball').height();
	var paddleHeight2 = $('#paddle2').height();				
	var paddleWidth = $('#paddle').width();
	var paddleHeight= $('#paddle').height();
	$(window).resize(function() {
		screenwidth = $(window).width() - $('#paddle').width();
		paddleWidth = $('#paddle').width();
		paddleWidth2 = $('#paddle2').width();
		circle_width = $(window).height()/5;
		$('#centercircle').css("width", circle_width+'px');
	})

	$('.gameplay').hide();
	$('.info_pages').hide();
	$('.settings').hide();
	$('.level').hide();
	$('.gameover').hide();

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
		game_speed = 10;
		$(this).css("background", "red");
		$('#play1').css("background", "grey");
		$('.level').hide();
	})
	var paddle_speed = 6;
	var game_speed = 6;
	$('#easy').click(function() {
		paddle_speed = 6;
		game_speed = 6;
		$(this).css("background", "turquoise");
		$('#medium').css("background", "grey");
		$('#hard').css("background", "grey");
	})
	$('#medium').click(function() {
		paddle_speed = 7;
		game_speed = 10;
		$(this).css("background", "green");
		$('#easy').css("background", "grey");
		$('#hard').css("background", "grey");
	})
	$('#hard').click(function() {
		paddle_speed = 10;
		game_speed = 15;
		$(this).css("background", "red");
		$('#easy').css("background", "grey");
		$('#medium').css("background", "grey");
	})
	var exit_clicked = false;
	var player_speed = 7;
	var paused = false;
	var playing = false;
	$('#play').click(function() {
		$('.start_screen').hide();
		$('.gameplay').show();
		if (game_speed == 15) {
			player_speed = 9;
		}
		var paused = false;
		var counter = 3;
		function timer () {
			exit_clicked = false;	
			$('#countdown').show();		
			expected_hit = paddleWidth2/2;
			resetting();			
			countInterval = setInterval(function() {
				counter--; 				
				if (counter < 0) {counter = 3; return;}
				if (counter == 0) {
					$('#countdown').empty().append(3).hide(); 
					$('#exit').show();
					resetgame = 0;
					counter = 3;
					clearInterval(countInterval);
					go();
				} 
				$('#countdown').empty().append(counter); 
			}, 1000)};
		timer();
	})
	$('html').keyup(function(e){
		keysDown[e.which] = false;
	})
	$('html').keydown(function (e) { // stay pressed
		keysDown[e.which] = true;
	})
	$('html').keypress(function (e) {
		if (e.which == 112) {
			if (!paused) {
				paused = true;
			}
			else {
				console.log("here");
				paused = false;
				if (playing) {
					animate(moving_left, moving_down, speed_x, speed_y);
				}
			}
		}

	})
	function go() {
		if (exit_clicked) {return;}	
		paused = false;
		startpos();
		animate(startleft, startup, 0, game_speed); // call the function the first time	
	}
	var moving_left;
	var moving_down;
	var speed_x;
	var speed_y;
	function animate(moveleft, movedown, x_speed, y_speed) {
		playing = true;
		if (exit_clicked) {return;}
		if (paused) {return;}
		x_movement = moveleft? "-="+x_speed : "+="+x_speed;
		y_movement = movedown? "+="+y_speed : "-="+y_speed;
		var paddlePos = $('#paddle').position();
		var paddlePos2 = $('#paddle2').position();
		if (!single_player) {
			if (keysDown[65]) { // letter 'a'
				if (0 < $('#paddle2').position().left) {
					$('#paddle2').animate({
						'left': '-='+player_speed}, 5 // move left
					);
				}
			}
			if (keysDown[68]) { // letter 'd'
				if (screenwidth > $('#paddle2').position().left) {
					$('#paddle2').animate({
						'left': '+='+player_speed}, 5 // move right
					);
				}
			}
		}
		if (single_player) {
			if (Math.abs(ball_x - (paddlePos2.left + expected_hit)) >= 7) {
				if (ball_x < paddlePos2.left + expected_hit) {
					if (0 < paddlePos2.left) {
						$('#paddle2').animate({
							'left': '-='+paddle_speed}, 2
						);
					}
				}
				if (ball_x > paddlePos2.left + expected_hit) {
					if (screenwidth > paddlePos2.left) {
						$('#paddle2').animate({
							'left': '+='+paddle_speed}, 2
						);
					}
				}
			} else if (Math.abs(ball_x - (paddlePos2.left + expected_hit)) > 2){
				if (ball_x < paddlePos2.left + expected_hit) {
					if (0 < $('#paddle2').position().left) {
						$('#paddle2').animate({
							'left': '-=1'}, 2
						);
					}
				}
				if (ball_x > paddlePos2.left + expected_hit) {
					if (screenwidth > paddlePos2.left) {
						$('#paddle2').animate({
							'left': '+=1'}, 2
						);
					}
				}
			}
		}
		if (keysDown[37]) { // left arrow
			if (0 < paddlePos.left) {
				$('#paddle').animate({
					'left': '-='+player_speed}, 5 // move left
				);
			}
		}
		if (keysDown[39]) { // right arrow
			if (screenwidth > paddlePos.left) {
				$('#paddle').animate({
					'left': '+='+player_speed}, 5 // move right
				);
			}
		}
		$('#ball').animate({ // animate the ball movement
				
			'left': x_movement, 'top': y_movement}, 13, "swing",function(){
				ball_y = $('#ball').position().top;
				ball_x =  $('#ball').position().left;
				if (exit_clicked) {return;}
				if (paused) {return;}
				if (ball_x < 0 || ($(window).width() - ball_width) < ball_x){
					moveleft = !moveleft; // flip the ball movement if hits wall
				}
				if (ball_y < 0 || ($(window).height() - ball_height) < ball_y){
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
						if (single_player && score1 == 10) {
							$('#gameover').append("COMPUTER WINS!");
						}
						else {
							$('#gameover').append("PLAYER " + winner + " WINS!");
						}
						$('.gameover').show();
					}
					return; // end sequence if hits top or bottom
				}					
				var impact_location;
				if ( (ball_y > paddlePos.top - 1.5*paddleHeight) && (ball_y < paddlePos.top) && (ball_x >  (paddlePos.left - ball_width)) && 
					(ball_x < paddlePos.left + paddleWidth)){
					impact_location = ball_x - paddlePos.left;
					pct_paddle_hit = impact_location/paddleWidth;
					if (pct_paddle_hit > 0.5) {
						x_speed = (pct_paddle_hit-0.5)*13;
						moveleft = false;
					}
					else {
						x_speed = (0.5-pct_paddle_hit)*13;
						moveleft = true;
					}
					if (game_speed == 10) {
						x_speed = x_speed*1.5;
					}
					if (game_speed == 15) {
						x_speed = x_speed*2;
					}
					movedown = false; // if hits paddle on bottom, send upwards
				}
				if ( (ball_y < paddlePos2.top + paddleHeight2) && (ball_y > paddlePos2.top) && (ball_x >  (paddlePos2.left - ball_width)) && 
					(ball_x < paddlePos2.left + paddleWidth2)){
					impact_location = ball_x - paddlePos2.left;
					pct_paddle_hit = impact_location/paddleWidth2;
					expected_hit = Math.ceil(Math.random() * paddleWidth2);
					if (pct_paddle_hit > 0.5) {
						x_speed = (pct_paddle_hit-0.5)*13;
						moveleft = false;
					}
					else {
						x_speed = (0.5-pct_paddle_hit)*13;
						moveleft = true;
					}
					movedown = true; // if hits top paddle, send downwards
					if (game_speed == 10) {
						x_speed = x_speed*1.5;
					}
					if (game_speed == 15) {
						x_speed = x_speed*2;
					}
				}
				moving_left = moveleft;
				moving_down = movedown;
				speed_x = x_speed;
				speed_y = y_speed;
				animate(moveleft, movedown, x_speed, y_speed); // call recursively
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
	function resetting() {
			playing = false;
			var heightdist = $('#paddle').position().height;
			var heightdist2 = $('#paddle2').position().height;
			var pos_left = $(window).width()*.46;
			var mid_width = $(window).width()/2;
			var start_height = $(window).height()*.48;
			leftdist = $('#paddle').position().width;
			$('#paddle').offset({top: heightdist, left: pos_left});
			$('#paddle2').offset({top: heightdist2, left: pos_left});
			if (resetgame == 1) {
				$('#ball').offset({top: start_height, left: mid_width});
			}
			expected_hit = paddleWidth2/2;
			if (resetgame == 0) {
				$('#ball').offset({top: start_height, left: mid_width}).delay(2000);
				startpos();
				go();
			}
	}
	$('#restart').click(function() {
		score1 = 0;
		score2 = 0;
		$('#p1Score').empty().append(score1);
		$('#p2Score').empty().append(score2);
		$('#gameover').empty();
		$('.gameover').hide();
		$('#exit').show();
		resetting();
		timer();
	})
	$('#exit').click(function() {
		score1 = 0;
		score2 = 0;
		exit_clicked = true;
		$('#p1Score').empty().append(score1);
		$('#p2Score').empty().append(score2);
		$('#gameover').empty();
		$('.gameover').hide();
		$('#ball').clearQueue();
		resetgame = 1;
		resetting();
		$('.gameplay').hide();
		$('.start_screen').show();
	})
})