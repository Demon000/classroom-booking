'use strict';

const config = require('./config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.set('view engine', 'ejs');

const api = require('./server/api');
app.use('/api', api);

const path = require('path');
const clientDir = path.join(__dirname, 'client');
app.use(express.static(clientDir));

app.get('/', function(req, res) {
    res.render(clientDir + '/index');
});

const error = require('./server/error');
app.use(error);

app.listen(config.port);
