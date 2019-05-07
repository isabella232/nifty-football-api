const _ = require('lodash');

const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(require('./_keys/futbol-cards-firebase-adminsdk')),
    databaseURL: 'https://futbol-cards.firebaseio.com'
});

const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.options('*', cors({origin: false}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// FIXME enable this in PROD?
// app.use(require('./api/logger'));

const image = require('./api/image');
const token = require('./api/token');
const marketplace = require('./api/marketplace');
const squad = require('./api/squad');
const headToHead = require('./api/games/headtohead');
const txs = require('./api/txs');
const activity = require('./api/activity');
const rarities = require('./api/rarities');
const eventScraper = require('./api/eventScraper');

const queryParamKeyChecker = require('./api/middlewares/queryParamKeyChecker');

// Image API (used as part of tokenUri() metadata)
app.use('/network/:network/image', image);

// Token API (serve tokenUri() metadata)
app.use('/network/:network/token', token);

// Marketplace API
app.use('/network/:network/marketplace', marketplace);

// Squad API
app.use('/network/:network/squad', squad);

// Games API
app.use('/network/:network/games/headtohead', headToHead);

// Transaction listener
app.use('/network/:network/txs', txs);

// Activity
app.use('/network/:network/activity', activity);

// Activity
app.use('/network/:network/rarities', rarities);

// Transaction listener
app.use('/network/:network/scraper', queryParamKeyChecker, eventScraper);

// Create "main" function to host all other top-level functions
const main = express();
main.use('/api', app);

// Slightly bump the defaults to 512mb and 2min timeout
const runtimeOpts = {
    memory: '512MB',
    timeoutSeconds: 240
};

// Expose Express API as a single Cloud Function:
exports.main = functions.runWith(runtimeOpts).https.onRequest(main);

/**
 * Triggered when a new event is added to the DB
 */
exports.newEventTrigger =
    functions.firestore
        .document('/events/{network}/data/{hash}')
        .onWrite(async (change, context) => {
            const get = require('lodash/get');

            const {network, hash} = context.params;
            const document = change.after.exists ? change.after.data() : null;

            console.info(`Event - onWrite @ [/events/${network}/data/${hash}]`, document);

            const event = get(document, 'event');

            // Handle differing events
            switch (event) {
                // default ERC721 events
                case 'Transfer':
                case 'Approval': {
                    const tokenId = get(document, 'returnValues.tokenId');
                    console.log(`Incoming token ID [${tokenId}] for event [${event}]`);
                    await require('./services/data/cards.service').rebuildAndStoreTokenDetails(network, tokenId);
                    break;
                }
                // token attribute changes
                case 'CardAttributesSet':
                case 'NameSet':
                case 'SpecialSet':
                case 'BadgeSet':
                case 'SponsorSet':
                case 'NumberSet':
                case 'BootsSet':
                case 'StarAdded':
                case 'XpAdded': {
                    const tokenId = get(document, 'returnValues._tokenId');
                    console.log(`Incoming token ID [${tokenId}] for event [${event}]`);
                    await require('./services/data/cards.service').rebuildAndStoreTokenDetails(network, tokenId);
                    break;
                }

            }
        });
