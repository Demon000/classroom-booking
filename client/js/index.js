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
    loaded: {
        rooms: false
    },
    isLoaded: function() {
        var r = true;
        for(var i in app.loaded) {
            if(!app.loaded[i]) {
                console.log('app not loaded yet.');
                r = false;
                break;
            }
        }
        return r;
    },
    get: {
        rooms: function(cb) {
            request
            .get('api/rooms')
            .end(function(err, res) {
                cb(err, res);
            });
        },
        events: function(q, cb) {
            request
            .get('api/events')
            .query(q)
            .end(function(err, res) {
                cb(err, res);
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
        app.get.rooms(function(err, res) {
            if(!err) {
                var rooms = res.body;
                app.loaded.rooms = true;
                app.roomSelector.setOptions(rooms);
                app.roomSelector.setActive(rooms[0]);

                if(app.isLoaded()) {
                    app.init();
                }
            } else {
                console.log(err, res);
            }
        });
    }
};

app.load();
