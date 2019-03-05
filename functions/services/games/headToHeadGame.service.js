const _ = require('lodash');
const {connectToHeadToHeadGame} = require("../web3/networks");
const futballCardsContractService = require("../futballcards.contract.service");

class HeadToHeadGameService {

    async getOpenGames(network = 1) {
        const headToHead = connectToHeadToHeadGame(network);

        const openGamesSize = await headToHead.openGamesSize();

        const openGames = [];

        for (let i = 0; i < openGamesSize; i++) {
            const gameId = await headToHead.openGames(i);

            if (gameId !== 0) {

                const game = await headToHead.getGame(gameId);
                const homeCard = await futballCardsContractService.tokenDetails(network, game.homeTokenId);
                const awayCard = await futballCardsContractService.tokenDetails(network, game.awayTokenId);

                openGames.push({
                    game: {
                        ...game
                    },
                    cards: {
                        homeCard: {
                            ...homeCard
                        },
                        awayCard: {
                            ...awayCard
                        }
                    }
                });
            }
        }

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

        return {
            homeTokenId: homeTokenId.toNumber(),
            homeOwner,
            awayTokenId: awayTokenId.toNumber(),
            awayOwner,
            state: state.toNumber(),
        };
    }

    async getGameForToken(network = 1, tokenId) {
        const headToHead = connectToHeadToHeadGame(network);

        const {
            homeTokenId,
            homeOwner,
            awayTokenId,
            awayOwner,
            state,
        } = await headToHead.getGameForToken(tokenId);

        return {
            homeTokenId: homeTokenId.toNumber(),
            homeOwner,
            awayTokenId: awayTokenId.toNumber(),
            awayOwner,
            state: state.toNumber(),
        };
    }
}

module.exports = new HeadToHeadGameService();
