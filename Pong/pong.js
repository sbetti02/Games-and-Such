
	var keysDown = {};
	var RIGHT_KEY = 39;
	var LEFT_KEY = 37;
	var A_KEY = 65;
	var D_KEY = 68;
	var score1 = 0;
	var score2 = 0;

	$(document).ready(function() {
// TODO:
	// fix reset button
	// make the deflection movement more intricate
	// Make an AI for 1 player mode
	// Allow player to select keys to play with?
	// Make a cooler background design?
		$('#paddle2').hide();
		$('#paddle').hide();
		$('#ball').hide();
		$('#p1Score').hide();
		$('#p2Score').hide();
		$('#reset_button').hide();
		$('#how_to').hide();
		$('#back').hide();
		$('#my_creds').hide();
		$('#countdown').hide();

		$('#instructions').click(function() {
			$('#how_to').show();
			$('#instructions').hide();
			$('#play').hide();
			$('#welcome_sign').hide();
			$('#back').show();
			$('#credits').hide();
		})

		$('#credits').click(function() {
			$('#my_creds').show();
			$('#instructions').hide();
			$('#play').hide();
			$('#welcome_sign').hide();
			$('#back').show();
			$('#credits').hide();
		})

		$('#back').click(function() {
			$('#how_to').hide();
			$('#instructions').show();
			$('#play').show();
			$('#welcome_sign').show();
			$('#back').hide();
			$('#credits').show();
			$('#my_creds').hide();
		})

		$('#play').click(function() {

			$('#play').hide();
			$('#welcome_sign').hide();
			$('#instructions').hide();
			$('#credits').hide();
			$('#paddle2').show();
			$('#paddle').show();
			$('#ball').show();
			$('#p1Score').show();
			$('#p2Score').show();
			$('#reset_button').show();

			$('#countdown').show();
			//$('#countdown')/*.delay(1000)*/.empty().append('2')//.delay(1000).empty().append('1').delay(1000).empty();
			var counter = 3;
			function timer () {
				countInterval = setInterval(function() {
				counter--; 				
				if (counter < 0) {return;}
				if (counter == 0) {
					$('#countdown').empty().append(3).hide(); 
					go();
					clearInterval(countInterval);
					//return;
				} 
				$('#countdown').empty().append(counter); 
			}, 1000)};

			timer();

			function go() {

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
				

				function animate(moveleft, movedown) {

					x_movement = moveleft? "-=4": "+=4";
					y_movement = movedown? "+=4": "-=4";
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
									reset();
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

							if ( (ball_y > paddlePos.top - 1.5*paddleHeight) && (ball_y < paddlePos.top) && (ball_x >  paddlePos.left) && 
								(ball_x < paddlePos.left + paddleWidth)){
								movedown = false; // if hits paddle on bottom, send upwards
							}
							if ( (ball_y < paddlePos2.top + paddleHeight2) && (ball_y > paddlePos2.top) && (ball_x >  paddlePos2.left) && 
								(ball_x < paddlePos2.left + paddleWidth2)){
								movedown = true; // if hits top paddle, send downwards
							}
							animate(moveleft,movedown); // call recursively
							console.log("x movement = " + x_movement);
							console.log("y movement = " + y_movement);

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
				//setTimeout(startpos, 2000);
				//setTimeout(startpos(), 2000);
				//setTimeout(animate(startleft, startup), 2000); // call the function the first time
				startpos();
				//timer();
				animate(startleft, startup); // call the function the first time

				function reset() {
					x_movement = 0;
					y_movement = 0;
					var heightdist = $('#paddle').position().height;
					var heightdist2 = $('#paddle2').position().height;
					var pos_left = $(window).width()*.46;
					var mid_width = $(window).width()/2;
					var start_height = $(window).height()*.48;
					leftdist = $('#paddle').position().width;
					$('#paddle').offset({top: heightdist, left: pos_left});
					$('#paddle2').offset({top: heightdist2, left: pos_left});
					$('#ball').offset({top: start_height, left: mid_width}).delay(2000);
					startpos();
					animate(startleft, startup);
				}

				$('#reset_button').click(function() { // TODO: make this call reset correctly, not just restart the page
					//location.reload();
					reset();
				})
			}

		})

	})