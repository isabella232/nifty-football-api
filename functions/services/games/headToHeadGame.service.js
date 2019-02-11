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

}

module.exports = new HeadToHeadGameService();
