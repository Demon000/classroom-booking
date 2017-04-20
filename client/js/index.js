var request = superagent;
var app = {
    dateSelector: new Calendar({
        input: document.querySelector('#date'),
        language: {
            month: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
            weekday: ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'],
            w : ['L', 'M', 'M', 'J', 'V', 'S', 'D']
        }
    }),
    roomSelector: new Selector({
        container: document.querySelector('#rooms')
    }),
    error: new Erroneous({
        container: document.querySelector('#error'),
        timed: true,
        duration: 10000
    }),
    eventsContainer: document.querySelector('#events'),
    get: {
        rooms: function(cbs, cbe) {
            request
            .get('api/rooms')
            .end(function(err, res) {
                if(err && cbe) {
                    cbe(err);
                } else {
                    cbs(res.body);
                }
            });
        },
        events: function(q, cbs, cbe) {
            request
            .get('api/events')
            .query(q)
            .end(function(err, res) {
                if(err && cbe) {
                    cbe(err);
                } else {
                    cbs(res.body);
                }
            });
        }
    },
    render: {
        events: function(events) {
            while(app.eventsContainer.lastChild) {
                app.eventsContainer.removeChild(app.eventsContainer.lastChild);
            }
            events.forEach(function(event) {
                var eventElement = createElement('div', {
                    class: 'event',
                    parent: app.eventsContainer
                });
                createElement('div', {
                    class: 'hour',
                    content: event.hour,
                    parent: eventElement
                });
                createElement('div', {
                    class: 'name',
                    content: event.name,
                    parent: eventElement
                });
                createElement('div', {
                    class: 'description',
                    content: event.description,
                    parent: eventElement
                });
            });
        }
    },
    load: {
        rooms: function(cb) {
            app.get.rooms(function(rooms) {
                app.roomSelector.setOptions(rooms, rooms[0]);
                if(cb) {
                    cb();
                }
            }, function(err) {
                console.log(err);
            });
        },
        events: function(q, cb) {
            app.get.events(q, function(events) {
                app.render.events(events);
                if(cb) {
                    cb();
                }
            }, function(err) {
                console.log(err);
            });
        },
        selectedEvents: function(cb) {
            var room = app.roomSelector.getActive();
            var date = app.dateSelector.getDate();
            var q = {
                room: room,
                year: date.year,
                month: date.month,
                day: date.day
            };
            app.load.events(q, cb);
        }
    },
    init: function() {
        app.dateSelector.on('dateChange', function() {
            app.load.selectedEvents();
        });
        app.roomSelector.on('activeChange', function() {
            app.load.selectedEvents();
        });
    },
    preinit: function() {
        app.load.rooms(function() {
            app.load.selectedEvents(app.init);
        })
    }
};

app.preinit();
