(function(){
    var defaultLanguage = {
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        weekday: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        w : ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    };

    function equals(a, b) {
        var r = false;
        if(a.year == b.year && a.month == b.month && a.day == b.day) {
            r = true;
        }
        return r;
    }

    function Calendar(o) {
        var language = o.language;
        if(!language) {
            language = defaultLanguage;
        }
        var container = o.container;
        if(!container) {
            container = document.body;
        }

        var c = this;
        Emitter.mixin(c);

        var input = o.input;
        var calendar;

        var now = new Date();
        var today = {
            year: now.getFullYear(),
            month: now.getMonth(),
            day: now.getDate()
        };

        var date = {};
        var view = {};

        c.getDate = function() {
            return date;
        };
        c.setDate = function(newDate) {
            if(!equals(newDate, date)) {
                var oldDate = date;
                date = newDate;
                var s = date.day + '/' + (date.month + 1) + '/' + date.year;
                input.value = s;
                c.emit('dateChange', oldDate, newDate);
            }
        };

        c.getView = function() {
            return view;
        };
        c.setView = function(newView) {
            var oldView = view;
            view = newView;
            generate(view.year, view.month);
            c.emit('viewChange', oldView, newView);
        };
        c.prev = function() {
            var newView = {
                year: view.year,
                month: view.month - 1,
                day: view.day
            };
            if(newView.month < 0) {
                newView.month = 11;
                newView.year = newView.year - 1;
            }
            c.setView(newView);
        };
        c.next = function() {
            var newView = {
                year: view.year,
                month: view.month + 1,
                day: view.day
            };
            if(newView.month > 11) {
                newView.month = 0;
                newView.year = newView.year + 1;
            }
            c.setView(newView);
        };

        function generate(year, month) {
            var position = input.getBoundingClientRect();
            var newCalendar = createElement('div', {
                class: 'calendar',
                style: {
                    top: position.bottom + 'px',
                    left: position.left + 'px'
                }
            });

            newCalendar.show = function() {
                newCalendar.classList.add('visible');
            };
            newCalendar.hide = function() {
                newCalendar.classList.remove('visible');
            };
            newCalendar.isVisible = function() {
                return newCalendar.classList.contains('visible');
            };

            var elClick;
            newCalendar.addEventListener('mousedown', function() {
                elClick = true;
            });
            newCalendar.addEventListener('mouseup', function() {
                elClick = false;
                input.focus();
            });
            input.addEventListener('focus', function() {
                newCalendar.show();
            });
            input.addEventListener('blur', function() {
                if(!elClick) {
                    newCalendar.hide();
                }
            });
            var meta = createElement('div', {
                class: 'meta',
                parent: newCalendar
            });
            createElement('p', {
                class: 'year',
                content: year,
                parent: meta
            });
            createElement('p', {
                class: 'month',
                content: language.month[month],
                parent: meta
            });
            var nav = createElement('div', {
                class: 'nav',
                parent: meta
            });

            var prev = createElement('i', {
                class: 'mdi mdi-menu-left',
                parent: nav
            });
            prev.addEventListener('click', c.prev);

            var next = createElement('i', {
                class: 'mdi mdi-menu-right',
                parent: nav
            });
            next.addEventListener('click', c.next);

            var header = createElement('div', {
                class: 'header',
                parent: newCalendar
            });
            language.w.forEach(function(d) {
                createElement('div', {
                    content: d,
                    parent: header
                });
            });

            var days = createElement('div', {
                class: 'days',
                parent: newCalendar
            });

            var monthStart = new Date(view.year, view.month, 1);
            var daysOffest = (monthStart.getDay() + 6) % 7;
            Range(1, daysOffest).forEach(function() {
                createElement('div', {
                    class: 'blank',
                    parent: days
                });
            });

            var monthEnd = new Date(view.year, view.month, 0);
            var daysNumber = monthEnd.getDate();
            Range(1, daysNumber).forEach(function(day) {
                var d = {
                    year: year,
                    month: month,
                    day: day
                };
                var el = createElement('div', {
                    content: day,
                    parent: days
                });
                el.addEventListener('click', function() {
                    c.setDate(d);
                });
                if(equals(d, today)) {
                    el.classList.add('today');
                }
                if(equals(d, date)) {
                    el.classList.add('date');
                }
                c.on('dateChange', function(oldDate, newDate) {
                    if(equals(d, oldDate)) {
                        el.classList.remove('date');
                    }
                    if(equals(d, newDate)) {
                        el.classList.add('date');
                    }
                });
            });

            if(calendar) {
                if(calendar.isVisible()) {
                    newCalendar.show();
                }
                container.replaceChild(newCalendar, calendar);
            } else {
                container.appendChild(newCalendar);
            }
            calendar =  newCalendar;
        }
        c.setView(today);
        c.setDate(today);
    }
    window.Calendar = Calendar;
})();
