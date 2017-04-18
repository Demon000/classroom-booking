'use strict';

const config = require('../config');

const express = require('express');
const router = express.Router();

router.get('/rooms', (req, res, next) => {
    var data = config.rooms;
    res.json(data);
});

module.exports = router;
