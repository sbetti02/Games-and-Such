$(document).ready(function() {
	for (i = 0; i < 13; i++) {
		$('<div/>', {
			'id': 'h_tick' + i,
			'class':'horiz_ticks'
		}).appendTo('body');
		$('#h_tick'+i).css("top", (i*50)+'px');
		if (i!=6)
			$('#h_tick'+i).append(6-i);
		$('<div/>', {
			'id': 'v_tick' + i,
			'class':'vert_ticks'
		}).appendTo('body');
		$('#v_tick'+i).css("left", (i*50)+'px').append(i-6);
	}
})