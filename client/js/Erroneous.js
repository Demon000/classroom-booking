(function(){
	function Erroneous(o) {
		if(!o.messages) {
			o.messages = {};
		}

		var ge = this;
		var container = o.container;
		var timed = false;
		var duration = 2000;
		var messages = o.messages;
		var timeout;

		if(o.timed) {
			timed = true;
		}
		if(o.duration) {
			timed = true;
			duration = o.duration;
		}

		ge.isVisible = function() {
			return container.classList.contains('visible');
		};
		ge.show = function(code, d) {
			var message = messages[code];
			if(!message) {
				message = code;
			}
			container.innerHTML = message;
			container.classList.add('visible');
			if(ge.isVisible() && timeout) {
				clearTimeout(timeout);
			}
			if(timed && d != 0) {
				timeout = setTimeout(ge.clear, d || duration);
			}
		};
		ge.clear = function() {
			container.classList.remove('visible');
			container.innerHTML = "";
		};
	}
	window.Erroneous = Erroneous;
})();
