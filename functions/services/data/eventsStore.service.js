const _ = require('lodash');

const firestore = require('./firebase.service').firestore();

const {contracts} = require('nifty-football-contract-tools');
const {getNetwork} = contracts;

const futballCardsContractService = require('../contracts/futballcards.contract.service');

class EventsStoreService {

    async rebuildAndStoreTokenDetails(network, tokenId) {
        const tokenDetails = await futballCardsContractService.tokenDetails(network, tokenId);
        return this.upsertAttrsAvg(network, tokenId, tokenDetails.attributeAvg);
    }

    async upsertEvent(network, eventData) {
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

    async upsertAttrsAvg(network, tokenId, attributeAvg) {
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


    async cardRankings(network) {
        return firestore
            .collection(`cards`)
            .doc(getNetwork(network))
            .collection('attributeAvg')
            .orderBy('attributeAvg', 'desc')
            .orderBy('tokenId', 'asc')
            .get()
            .then((querySet) => {
                const tokens = new Set();
                querySet.forEach((doc) => {
                    tokens.add(doc.data());
                });
                return Array.from(tokens);
            });
    }
}

module.exports = new EventsStoreService();
