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
                    cbs(res);
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
                    cbs(res);
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
        app.get.rooms(function(res) {
            var rooms = res.body;
            app.roomSelector.setOptions(rooms);
            app.roomSelector.setActive(rooms[0]);
        }, function(err) {
            console.log(err, res);
        });
    }
};

app.load();
