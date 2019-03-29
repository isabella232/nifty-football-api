const functions = require('firebase-functions');

const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(require('./_keys/futbol-cards-firebase-adminsdk')),
    databaseURL: "https://futbol-cards.firebaseio.com"
});

const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(require('./api/logger'));

const token = require('./api/token');
const marketplace = require('./api/marketplace');
const image = require('./api/image');
const headToHead = require('./api/games/headtohead');
const txs = require('./api/txs');
const eventScraper = require('./api/eventScraper');

const queryParamKeyChecker = require('./api/middlewares/queryParamKeyChecker');

// Image API (used as part of tokenUri() metadata)
app.use('/network/:network/image', image);

// Token API (serve tokenUri() metadata)
app.use('/network/:network/token', token);

// Marketplace API
app.use('/network/:network/marketplace', marketplace);

// Games API
app.use('/network/:network/games/headtohead', headToHead);

// Transaction listener
app.use('/network/:network/txs', txs);

// Transaction listener
app.use('/network/:network/scraper', queryParamKeyChecker, eventScraper);

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);

