const _ = require('lodash');

const firestore = require('./firebase.service').firestore();

const {getNetwork} = require('nifty-football-contract-tools').contracts;

const futballCardsContractService = require('../contracts/futballcards.contract.service');

class CardsService {

    async rebuildAndStoreTokenDetails(network, tokenId) {
        console.log(`Rebuild and storing token details for ID [${tokenId}] on network [${network}]`);

        const tokenDetails = await futballCardsContractService.tokenDetails(network, tokenId);

        await this.upsertAttrsAvg(network, tokenId, tokenDetails.attributeAvg);

        // FIXME Why have two collections?
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

    async getTopPlayerInPositionForAddress(network, address, position, total) {
        return firestore
            .collection(`cards`)
            .doc(getNetwork(network))
            .collection('players')
            .where('owner', '==', address) // TODO checksum all addresses before save and at query
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
