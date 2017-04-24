'use strict';

const errors = {
	'EVADDCON': {
		status: 409,
		message: 'An event at the same date and hour already exists.'
	},
	'INVPASS': {
		status: 403,
		message: 'An invalid password has been suplied.'
	}
};

function handler(err, req, res, next) {
	let code = err.message;
	if(errors[code]) {
		let error = errors[code];
		res.status(error.status);
		res.json({
			message: error.message,
			code: code
		});
	} else {
		console.log(code);
		next();
	}
}

module.exports = handler;
