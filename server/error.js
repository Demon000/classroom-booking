'use strict';

const errors = {
	'EVADDCON': {
		status: 409,
		message: 'An event at the same date and hour already exists.'
	},
	'INVPASS': {
		status: 403,
		message: 'An invalid password has been suplied.'
	},
	'INVDATA': {
		status: 422,
		message: 'Invalid data.'
	}
};

function handler(err, req, res, next) {
	let code = err.message;
	if(errors[code]) {
		let error = errors[code];
		error.code = code;
		res.status(error.status);
		res.json(error);
	} else {
		console.log(code);
		next();
	}
}

module.exports = handler;
