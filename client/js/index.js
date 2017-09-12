var request = superagent;

var dateSelector = new Calendar({
	input: document.querySelector('#date'),
	language: {
		month: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
		weekday: ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'],
		w : ['L', 'M', 'M', 'J', 'V', 'S', 'D']
	}
});

var roomSelector = new Selector({
	container: document.querySelector('#rooms')
});

var error = new Erroneous({
	container: document.querySelector('#error'),
	timed: true,
	duration: 10000,
	messages: {
		'EVADDCON': 'Există deja o programare la această oră!',
		'INVPASS': 'Parola este incorectă!',
		'INVHOUR': 'Ora trebuie să fie între 7 și 20!',
		'EMPTYFLD': 'Toate câmpurile sunt obligatorii!'
	}
});

var showAddDialogButton = document.querySelector('#show-add-dialog');
var addDialogContainer = document.querySelector('#add-dialog-container');
var addDialogElement = document.querySelector('#add-dialog');
function addDialogShow() {
	addDialogContainer.classList.add('visible');
}
function addDialogHide() {
	addDialogContainer.classList.remove('visible');
	error.clear();
}
function addDialogInit() {
	var hourInput = addDialogElement.querySelector('#add-dialog-hour');
	var nameInput = addDialogElement.querySelector('#add-dialog-name');
	var descriptionInput = addDialogElement.querySelector('#add-dialog-description');
	var passwordInput = addDialogElement.querySelector('#add-dialog-password');

	var cancelButton = addDialogElement.querySelector('#add-dialog-cancel');
	cancelButton.addEventListener('click', addDialogHide);
	var addButton = addDialogElement.querySelector('#add-dialog-add');
	addButton.addEventListener('click', function() {
		var date = dateSelector.getDate();

		var data = {
			room: roomSelector.getActive(),
			year: date.year,
			month: date.month,
			day: date.day,
			hour: hourInput.value,
			name: nameInput.value,
			description: descriptionInput.value,
			password: passwordInput.value
		};
		requests.post.events(data, function(events) {
			renderEvents(events);
			addDialogHide();
		}, function(err, body) {
			error.show(body.code);
		});
	});
}

var  requests = {
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
	}
};

var eventsContainer = document.querySelector('#events');
function renderEvents(events) {
	while(eventsContainer.lastChild) {
		eventsContainer.removeChild(eventsContainer.lastChild);
	}
	events.forEach(function(event) {
		var eventElement = createElement('div', {
			class: 'event',
			parent: eventsContainer
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
function loadEvents(q, cb) {
	requests.get.events(q, function(events) {
		renderEvents(events);
		if(cb) {
			cb();
		}
	}, function(err) {
		console.log(err);
	});
}
function loadSelectedEvents(cb) {
	var room = roomSelector.getActive();
	var date = dateSelector.getDate();
	var q = {
		room: room,
		year: date.year,
		month: date.month,
		day: date.day
	};
	loadEvents(q, cb);
}

function loadRooms(cb) {
	requests.get.rooms(function(rooms) {
		roomSelector.setOptions(rooms, rooms[0]);
		if(cb) {
			cb();
		}
	}, function(err) {
		console.log(err);
	});
}

function init() {
	dateSelector.on('dateChange', function() {
		loadSelectedEvents();
	});
	roomSelector.on('activeChange', function() {
		loadSelectedEvents();
	});
	addDialogInit();
	showAddDialogButton.addEventListener('click', addDialogShow);
}

function preinit() {
	loadRooms(function() {
		loadSelectedEvents(init);
	});
}

preinit();
