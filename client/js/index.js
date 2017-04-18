var request = superagent;
var app = {
    loaded: {
        rooms: false,
        events: false
    },
    isLoaded: function() {
        var r = true;
        for(var i in app.loaded) {
            if(!app.loaded[i]) {
                r = false;
                break;
            }
        }
        return r;
    },
    fetch: {
          rooms: function(cb) {
              request
              .get('api/rooms')
              .end(function(err, res) {
                  cb(err, res);
              });
          }
    },
    load: function() {
        app.fetch.rooms(function(err, res) {
            if(!err) {
               if(app.isLoaded()) {
                   app.init();
               } else {
                   console.log('Not loaded yet');
               }
            } else {
                console.log(err, res);
            }
        });
    },
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
    })
};
