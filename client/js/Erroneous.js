(function(){
	function Erroneous(o) {
		var ge = this;
		var container = o.container;
		var timed = false;
		var duration = 2000;
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
		ge.show = function(m, d) {
			container.innerHTML = m;
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
