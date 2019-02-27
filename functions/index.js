const functions = require('firebase-functions');

const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('./api/logger'));

const token = require('./api/token');
const marketplace = require('./api/marketplace');
const image = require('./api/image');
const headToHead = require('./api/games/headtohead');

// IMAGE API
app.use('/network/:network/image', image);

// TOKEN API
app.use('/network/:network/token', token);

// MARKETPLACE API
app.use('/network/:network/marketplace', marketplace);

// GAME API
app.use('/network/:network/games/headtohead', headToHead);

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);

