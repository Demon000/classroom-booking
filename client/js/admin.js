var showDeleteDialogButton = document.querySelector('#show-delete-dialog');
var deleteDialogContainer = document.querySelector('#delete-dialog-container');
var deleteDialogElement = document.querySelector('#delete-dialog');
function deleteDialogShow() {
	deleteDialogContainer.classList.add('visible');
}
function deleteDialogHide() {
	deleteDialogContainer.classList.remove('visible');
	error.clear();
}
function deleteDialogInit() {
	var hourInput = deleteDialogElement.querySelector('#delete-dialog-hour');
	var passwordInput = deleteDialogElement.querySelector('#delete-dialog-password');

	var cancelButton = deleteDialogElement.querySelector('#delete-dialog-cancel');
	cancelButton.addEventListener('click', deleteDialogHide);
	var deleteButton = deleteDialogElement.querySelector('#delete-dialog-delete');
	deleteButton.addEventListener('click', function() {
		var date = dateSelector.getDate();

		var data = {
			room: roomSelector.getActive(),
			year: date.year,
			month: date.month,
			day: date.day,
			hour: hourInput.value,
			password: passwordInput.value
		};
		requests.delete.events(data, function(events) {
			renderEvents(events);
			deleteDialogHide();
		}, function(err, body) {
			error.show(body.code);
		});
	});
}

function adminInit() {
    deleteDialogInit();
    showDeleteDialogButton.addEventListener('click', deleteDialogShow);
}

function adminPreinit() {
    adminInit();
}

adminPreinit();
