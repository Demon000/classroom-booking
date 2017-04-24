'use strict';

const config = require('./config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('client'));
app.use(bodyParser.json());

const api = require('./server/api');
app.use('/api', api);

const error = require('./server/error');
app.use(error);

app.listen(config.port);
