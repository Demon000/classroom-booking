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

module.exports = router;
