'use strict';

const config = require('../config');

const validator = require('validator');

const lowdb = require('lowdb');
const db = lowdb(config.dbPath);
db.defaults({
	events: []
}).write();

const express = require('express');
const router = express.Router();

function filterEvents(q) {
	let data = db.get('events').filter(q).sortBy([(e) => {
		return parseInt(e.hour, 10);
	}]).value();
	return data;
}

router.get('/rooms', (req, res, next) => {
	let data = config.rooms;
	res.json(data);
});
router.get('/events' , (req, res, next) => {
	let q = req.query;
	let data = filterEvents(q);
	res.json(data);
});

function authorize(req, res, next) {
	if(req.body.password != config.password) {
		return next(new Error('INVPASS'));
	}
	next();
}
function sanitize(req, res, next) {
	let b = req.body;
	for(var i in b) {
		if(typeof b[i] == 'number') {
			b[i] = b[i].toString();
		} else {
			b[i] = validator.escape(b[i]);
		}
	}
	next();
}
function validate(req, res, next) {
	let b = req.body;
	let valid = true;
	const numeric = ['year', 'month', 'day', 'hour'];
	valid = numeric.every(i => validator.isNumeric(b[i]));
	if(config.rooms.indexOf(b.room) == -1) {
		valid = false;
	}
	if(!valid) {
		return next(new Error('INVDATA'));
	}

	if(b.hour < 7 || b.hour > 20) {
		return next(new Error('INVHOUR'));
	}
	for(let i in b) {
		if(validator.isEmpty(b[i])) {
			return next(new Error('EMPTYFLD'));
		}
	}
	next();
}
router.post('/events', authorize, sanitize, validate, (req, res, next) => {
	let b = req.body;
	console.log(b);
	let sameHour = db.get('events').find({
		room: b.room,
		year: b.year,
		month: b.month,
		day: b.day,
		hour: b.hour
	}).value();

	if(sameHour) {
		return next(new Error('EVADDCON'));
	}

	db.get('events').push({
		room: b.room,
		year: b.year,
		month: b.month,
		day: b.day,
		hour: b.hour,
		name: b.name,
		description: b.description
	}).write();

	let sameDay = filterEvents({
		room: b.room,
		year: b.year,
		month: b.month,
		day: b.day
	});
	res.json(sameDay);
});

module.exports = router;
