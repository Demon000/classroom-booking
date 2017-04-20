'use strict';

const config = require('../config');

const lowdb = require('lowdb');
const db = lowdb(config.dbPath);
db.defaults({
	events: []
}).write();

const express = require('express');
const router = express.Router();

router.get('/rooms', (req, res, next) => {
	let data = config.rooms;
	res.json(data);
});
router.get('/events' , (req, res, next) => {
	let q = req.query;
	let view = db.get('events');
	if(q.room) {
		view.filter({room: q.room});
	}
	if(q.year) {
		view.filter({year: q.year});
	}
	if(q.month) {
		view.filter({month: q.month});
	}
	if(q.day) {
		view.filter({day: q.day});
	}
	let data = view.value();
	console.log(q, data);
	res.json(data);
});
router.post('/events', (req, res, next) => {
	let b = req.body;

	if(b.password != config.password) {
		return next(new Error('INVPASS'));
	}

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

	let sameDay = db.get('events').filter({
		room: b.room,
		year: b.year,
		month: b.month,
		day: b.day
	}).sortBy('hour').value();
	res.json(sameDay);
});

module.exports = router;
