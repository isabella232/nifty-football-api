const functions = require('firebase-functions');

const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('./api/logger'));

app.get('/card', async (request, response) => {
    return require('./image').fillSVG(request, response);
});

app.get('/mockup', async (request, response) => {
    return require('./image').cardMockup(request, response);
});


// TOKEN API

app.get('/network/:network/pointers', async (request, response) => {
    return require('./token').tokenPointers(request, response);
});

app.get('/network/:network/token/:tokenId', async (request, response) => {
    return require('./token').tokenDetails(request, response);
});

// GAME API

app.use('/games/headtohead', require('./api/games/headtohead'));


// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);

