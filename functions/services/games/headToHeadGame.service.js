const _ = require('lodash');
const {connectToHeadToHeadGame} = require("../web3/networks");

class HeadToHeadGameService {

    async getOpenGames(network = 1) {
        const headToHead = connectToHeadToHeadGame(network);

        const openGames = await headToHead.openGames();

        return {
            openGames
        };
    }

    async getGame(network = 1, gameId) {
        const headToHead = connectToHeadToHeadGame(network);

        const {
            homeTokenId,
            homeOwner,
            awayTokenId,
            awayOwner,
            state,
        } = await headToHead.getGame(gameId);

        // TODO normalise
        return {
            homeTokenId,
            homeOwner,
            awayTokenId,
            awayOwner,
            state,
        };
    }
}

module.exports = new HeadToHeadGameService();
