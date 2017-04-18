(function() {
    function Selector(o) {
        var s = this;
        Emitter.mixin(s);

        var active;
        var options = {};
        var container = o.container;

        s.getActive = function() {
            return active;
        };
        s.setActive = function(op) {
            if(op != active) {
                var oldActive = active;
                active = op;
                s.emit('activeChange', oldActive, active);
            }
        };
        s.getOptions = function() {
            return options;
        };

        o.options.forEach(function(op) {
            var el = createElement('div', {
                content: op
            });
            el.addEventListener('click', function() {
                s.setActive(op);
            });
            s.on('activeChange', function(oldActive, newActive) {
                if(op == oldActive) {
                    el.classList.remove('active');
                }
                if(op == newActive) {
                    el.classList.add('active');
                }
            });
            options[op] = el;
            container.appendChild(el);
        });

        if(!o.default) {
            o.default = o.options[0];
        }
        s.setActive(o.default);
    }

    window.Selector = Selector;
})();
