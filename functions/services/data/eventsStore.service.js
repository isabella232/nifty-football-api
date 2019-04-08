const _ = require('lodash');

const firestore = require('./firebase.service').firestore();

const {contracts} = require('nifty-football-contract-tools');
const {getNetwork} = contracts;

class EventsStoreService {

    async upsertEvent (network, eventData) {
        return firestore
            .collection('events')
            .doc(network)
            .collection('data')
            .doc(eventData.id)
            .set(eventData)
            .then(ref => {
                return ref.id;
            });
    }

    async upsertAttrsAvg (network, tokenId, attributeAvg) {
        console.log(`Upserting average attrs [${network}] [${tokenId}] [${attributeAvg}]`);

        const data = {
            tokenId: tokenId,
            attributeAvg: attributeAvg,
        };

        return firestore
            .collection(`cards`)
            .doc(getNetwork(network))
            .collection(`attributeAvg`)
            .doc(_.toString(tokenId))
            .set(data)
            .then(() => {
                return data;
            });
    }
}

module.exports = new EventsStoreService();