const _ = require('lodash');

const firestore = require('./firebase.service').firestore();

const {getNetwork} = require('nifty-football-contract-tools').contracts;

const futballCardsContractService = require('../contracts/futballcards.contract.service');

class CardsService {

    async rebuildAndStoreTokenDetails(network, tokenId) {
        console.log(`Rebuild and storing token details for ID [${tokenId}] on network [${network}]`);

        const tokenDetails = await futballCardsContractService.tokenDetails(network, tokenId);
        return this.upsertAttrsAvg(network, tokenId, tokenDetails.attributeAvg);
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

module.exports = new CardsService();
