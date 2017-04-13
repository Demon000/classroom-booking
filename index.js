'use strict';

const config = require('../config');

const express = require('express');
const app = express();

app.use(express.static('client'));

app.listen(config.port);
