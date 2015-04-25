com.dowjones.mouse = {
	x: 0,
	y: 0,
	set: function(e) {
		if(typeof event != 'undefined' && 
			typeof event.clientX != 'undefined' && 
			typeof document.body != 'undefined' && 
			document.body != null)
		{
			com.dowjones.mouse.x = event.clientX + document.body.scrollLeft;
			com.dowjones.mouse.y = event.clientY + document.body.scrollTop;
		} else {
			com.dowjones.mouse.x = e.pageX;
			com.dowjones.mouse.y = e.pageY;
		}
		return true;
	},
	init: function() {
		if(typeof document.captureEvents != 'undefined') {
			document.captureEvents(Event.MOUSEMOVE);
		}
		document.onmousemove = this.set;
	}
}
com.dowjones.mouse.init();
