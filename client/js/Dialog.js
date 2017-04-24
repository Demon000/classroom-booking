(function(){
	function Dialog(o) {
		var d = this;

		d.container = o.container;
		d.template = d.container.removeChild(o.template);

		d.show = function() {
			d.container.classList.add('visible');
		};
		d.hide = function() {
			d.container.classList.remove('visible');
		};
		d.container.addEventListener('click', function(e) {
			if(e.target == d.container) {
				d.container.classList.remove('visible');
			}
		});

		d.refresh = function() {
			if(d.element) {
				d.container.removeChild(d.element);
			}
			d.element = d.template.cloneNode(true);
			d.container.appendChild(d.element);
		};
		d.configure = function(f) {
			f(d.element);
		};
		d.reconfigure = function(f) {
			d.refresh();
			d.configure(f);
		};

		d.refresh();
	};

	window.Dialog = Dialog;
})();