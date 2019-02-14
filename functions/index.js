const functions = require('firebase-functions');

const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('./api/logger'));

// IMAGE API
app.use('/network/:network/image', require('./api/image'));

// TOKEN API
app.use('/network/:network/token', require('./api/token'));

// GAME API
app.use('/network/:network/games/headtohead', require('./api/games/headtohead'));

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);

