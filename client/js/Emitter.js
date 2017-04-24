(function(){
	function Emitter(listeners) {
		var e = this;
		var _listeners = {};
		if(listeners) {
			_listeners = listeners;
		}
		e.emit = function(name) {
			var data = Array.from(arguments).slice(1);
			if(_listeners[name]) {
				_listeners[name].forEach(function(f) {
					f.apply(e, data);
				});
			}
		};
		e.on = function(name, f) {
			if(!_listeners[name]) {
				_listeners[name] = [];
			}
			_listeners[name].push(f);
		};
		e.remove = function(name, f) {
			_listeners[name].filter(function(l) {
				return l != f;
			});
		};
		e.listeners = function(name) {
			return _listeners[name];
		};
		e.events = function(name) {
			return Object.keys(_listeners);
		};
	}
	Emitter.mixin = function(obj, listeners) {
		var emitter = new Emitter(listeners);
		Object.keys(emitter).forEach(function(s) {
			obj[s] = emitter[s];
		});
	};
	window.Emitter = Emitter;
})();