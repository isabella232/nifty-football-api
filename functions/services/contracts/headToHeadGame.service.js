const _ = require('lodash');
const {connectToHeadToHeadGame} = require("../web3/networks");
const futballCardsContractService = require("./futballcards.contract.service");

class HeadToHeadGameService {

    async getOpenGames(network = 1) {
        const headToHead = connectToHeadToHeadGame(network);

        const {_size} = await headToHead.openGamesSize();
        console.log("openGamesSize", _size);
        console.log("_size.toNumber()", _size.toNumber());

        const openGames = [];

        for (let i = 0; i < _size.toNumber(); i++) {
            const gameId = (await headToHead.openGames(i))[0].toNumber();
            console.log("gameId", gameId);

            if (gameId !== 0) {

                const game = await this.getGame(network, gameId);

                const homeCard = game.state !== 0 && game.homeTokenId !== 0
                    ? await futballCardsContractService.tokenDetails(network, game.homeTokenId)
                    : {};

                const awayCard = game.state !== 0 && game.awayTokenId !== 0
                    ? await futballCardsContractService.tokenDetails(network, game.awayTokenId)
                    : {};

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
        console.log(`Get game details for ID [${gameId}] on network [${network}]`);

        const headToHead = connectToHeadToHeadGame(network);

        const {
            homeTokenId,
            homeOwner,
            awayTokenId,
            awayOwner,
            state,
        } = await headToHead.getGame(gameId);

        return {
            gameId,
            homeTokenId: homeTokenId.toNumber(),
            homeOwner,
            awayTokenId: awayTokenId.toNumber(),
            awayOwner,
            state: state.toNumber(),
        };
    }

    async getGameForToken(network = 1, tokenId) {
        console.log(`Get game for token ID [${tokenId}] on network [${network}]`);

        const headToHead = connectToHeadToHeadGame(network);

        const {
            gameId,
            homeTokenId,
            homeOwner,
            awayTokenId,
            awayOwner,
            state,
        } = await headToHead.getGameForToken(tokenId);

        const numState = state.toNumber();
        const numHomeTokenId = homeTokenId.toNumber();
        const numAwayTokenId = awayTokenId.toNumber();

        console.log(numState, numHomeTokenId, numAwayTokenId);

        // Dont make the call for token details if game not created
        const homeCard = numState !== 0 && numHomeTokenId !== 0
            ? await futballCardsContractService.tokenDetails(network, homeTokenId)
            : {};

        const awayCard = numState !== 0 && numAwayTokenId !== 0
            ? await futballCardsContractService.tokenDetails(network, awayTokenId)
            : {};

        return {
            game: {
                gameId,
                homeTokenId: numHomeTokenId,
                homeOwner,
                awayTokenId: numAwayTokenId,
                awayOwner,
                state: numState,
            },
            cards: {
                homeCard: {
                    ...homeCard
                },
                awayCard: {
                    ...awayCard
                }
            }
        };
    }
}

module.exports = new HeadToHeadGameService();
