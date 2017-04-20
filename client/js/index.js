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
    init: function() {
        app.dateSelector.on('dateChange', function() {
            console.log('dateChange event');
        });
        app.roomSelector.on('activeChange', function() {
            console.log('activeChange event');
        });
    },
    load: function() {
        app.get.rooms(function(rooms) {
            app.roomSelector.setOptions(rooms, rooms[0]);
            var room = app.roomSelector.getActive();
            var date = app.dateSelector.getDate();
            var q = {
                room: room,
                year: date.year,
                month: date.month,
                day: date.day
            };
            app.get.events(q, function(events) {
            }, function(err) {
                console.log(err);
            });
        }, function(err) {
            console.log(err);
        });
    }
};

app.load();
