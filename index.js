'use strict';

const config = require('./config');

const express = require('express');
const app = express();

app.use(express.static('client'));

const api = require('./server/api');
app.use('/api', api);

app.listen(config.port);
