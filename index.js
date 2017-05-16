'use strict';

const config = require('./config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('client'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

const api = require('./server/api');
app.use('/api', api);

app.get('/', function(req, res) {
    res.render('client/index');
});

const error = require('./server/error');
app.use(error);

app.listen(config.port);
