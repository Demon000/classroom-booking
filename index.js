'use strict';

const config = require('./config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('client'));
app.use(bodyParser.json({
	reviver(key, value) {
		return typeof value == 'number' ? value.toString() : value;
	}
}));

const api = require('./server/api');
app.use('/api', api);

app.listen(config.port);
