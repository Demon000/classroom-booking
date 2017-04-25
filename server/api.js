'use strict';

const config = require('../config');

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

router.post('/events', authorize, (req, res, next) => {
	let b = req.body;

	for(var i in b) {
		if(typeof b[i] == 'number') {
			b[i] = b[i].toString();
		}		
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

	let sameDay = filterEvents({
		room: b.room,
		year: b.year,
		month: b.month,
		day: b.day
	});
	res.json(sameDay);
});

module.exports = router;
