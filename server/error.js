'use strict';

const errors = {
	'EVADDCON': {
		status: 409
	},
	'INVPASS': {
		status: 403
	},
	'INVDATA': {
		status: 422
	},
	'INVHOUR': {
		status: 422
	},
	'EMPTYFLD': {
		status: 422
	},
	'EVDELNEX': {
		status: 404
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
