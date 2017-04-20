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

module.exports = router;
