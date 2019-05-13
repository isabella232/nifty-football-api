const _ = require('lodash');

const firestore = require('./firebase.service').firestore();

const {getNetwork} = require('nifty-football-contract-tools').contracts;

const niftyFootballContractService = require('../contracts/niftyFootball.contract.service');

class CardsService {

    async rebuildAndStoreTokenDetails(network, tokenId) {
        console.log(`Rebuild and storing token details for ID [${tokenId}] on network [${network}]`);

        const tokenDetails = await niftyFootballContractService.tokenDetails(getNetwork(network), tokenId);

        return this.upsertPlayerDetails(network, tokenId, tokenDetails);
    }

    async upsertPlayerDetails(network, tokenId, tokenDetails) {
        console.log(`Upsert player details [${network}] [${tokenId}]`);

        return firestore
            .collection(`cards`)
            .doc(getNetwork(network))
            .collection(`players`)
            .doc(_.toString(tokenId))
            .set({
                tokenId,
                ...tokenDetails
            })
            .then(() => {
                return tokenDetails;
            });
    }

    async cardRankings(network, limit = 100) {
        return firestore
            .collection(`cards`)
            .doc(getNetwork(network))
            .collection('players')
            .orderBy('attributeAvg', 'desc')
            .orderBy('tokenId', 'asc')
            .limit(limit)
            .get()
            .then((querySet) => {
                const tokens = new Set();
                querySet.forEach((doc) => {
                    tokens.add(doc.data());
                });
                return Array.from(tokens);
            });
    }

    async latestCards(network, limit = 50) {
        return firestore
            .collection(`cards`)
            .doc(getNetwork(network))
            .collection('players')
            .orderBy('tokenId', 'desc')
            .limit(_.toNumber(limit))
            .get()
            .then((querySet) => {
                const tokens = new Set();
                querySet.forEach((doc) => {
                    tokens.add(doc.data());
                });
                return Array.from(tokens);
            });
    }

    async getTopPlayersInPositionForAddress(network, address, position, total = 1) {
        return firestore
            .collection(`cards`)
            .doc(getNetwork(network))
            .collection('players')
            .where('owner', '==', address.toLowerCase())  // FIXME James - checksum or this OK?
            .where('position', '==', position)
            .orderBy('attributeAvg', 'desc')
            .limit(total)
            .get()
            .then((querySet) => {
                const cards = [];
                querySet.forEach((doc) => {
                    cards.push(doc.data());
                });
                return cards;
            });
    }
}

module.exports = new CardsService();
