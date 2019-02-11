const functions = require('firebase-functions');

const cors = require('cors');
const express = require('express');
const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

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

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);

