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
	let data = db.get('events').filter(q).value();
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
