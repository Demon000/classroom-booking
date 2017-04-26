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
		duration: 10000,
		messages: {
			'EVADDCON': 'Există deja o programare la această oră!',
			'INVPASS': 'Parola este incorectă!',
		}
	}),
	addDialog: {
		container: document.querySelector('#add-dialog-container'),
		element: document.querySelector('#add-dialog'),
		show: function() {
			app.addDialog.container.classList.add('visible');
		},
		hide: function() {
			app.addDialog.container.classList.remove('visible');
		},
		init: function() {
			var dialog =  this.element;
			var hourInput = dialog.querySelector('#hour');
			var nameInput = dialog.querySelector('#name');
			var descriptionInput = dialog.querySelector('#description');
			var passwordInput = dialog.querySelector('#password');

			var cancelButton = dialog.querySelector('#add-dialog-cancel');
			cancelButton.addEventListener('click', app.addDialog.hide);
			var addButton = dialog.querySelector('#add-dialog-add');
			addButton.addEventListener('click', function() {
				var date = app.dateSelector.getDate();

				var data = {
					room: app.roomSelector.getActive(),
					year: date.year,
					month: date.month,
					day: date.day,
					hour: hourInput.value,
					name: nameInput.value,
					description: descriptionInput.value,
					password: passwordInput.value
				};

				if(isNaN(data.hour)) {
					app.error.show('Ora este invalidă!');
				} else if(data.hour < 7 || data.hour > 20) {
					app.error.show('Ora trebuie să fie între 7 și 20!')
				} else if(!data.name) {
					app.error.show('Numele nu poate fi gol!');
				} else if(!data.description) {
					app.error.show('Descrierea nu poate fi goală!');
				} else if(!data.password) {
					app.error.show('Parola nu poate fi goală!');
				} else {
					app.post.events(data, function(events) {
						app.render.events(events);
						app.addDialog.hide();
					}, function(err, body) {
						app.error.show(body.code);
					});
				}
			});
		}
	},
	showAddDialog: document.querySelector('#show-add-dialog'),
	eventsContainer: document.querySelector('#events'),
	get: {
		rooms: function(cbs, cbe) {
			request
			.get('api/rooms')
			.end(function(err, res) {
				if(err && cbe) {
					cbe(err, res.body);
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
					cbe(err, res.body);
				} else {
					cbs(res.body);
				}
			});
		}
	},
	post: {
		events: function(b, cbs, cbe) {
			request
			.post('api/events')
			.send(b)
			.end(function(err, res) {
				if(err && cbe) {
					cbe(err, res.body);
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
		app.addDialog.init();
		app.showAddDialog.addEventListener('click', app.addDialog.show);
	},
	preinit: function() {
		app.load.rooms(function() {
			app.load.selectedEvents(app.init);
		})
	}
};

app.preinit();
