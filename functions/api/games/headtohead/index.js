const _ = require('lodash');

const headToHeadGameService = require('../../../services/contracts/headToHeadGame.service');

const headToHead = require('express').Router({mergeParams: true});

headToHead.get('/list/open', async (req, res, next) => {
    try {
        const {network} = req.params;

        const {openGames} = await headToHeadGameService.getOpenGames(network);

        return res
            .status(200)
            .json({
                openGames
            });
    } catch (e) {
        next(e);
    }
});

headToHead.get('/game/:gameId', async (req, res, next) => {
    try {
        const {network, gameId} = req.params;

        const details = await headToHeadGameService.getGame(network, gameId);

        return res
            .status(200)
            .json(details);

    } catch (e) {
        next(e);
    }
});

headToHead.get('/tokens', async (req, res, next) => {
    try {
        const {network} = req.params;

        // Map to an array
        let tokenIds = _.get(req.query, 'tokenId', []);
        if (tokenIds && !_.isArray(tokenIds)) {
            tokenIds = [tokenIds];
        }

        const promises = _.map(tokenIds, (tokenId) => {
            return headToHeadGameService.getGameForToken(network, tokenId);
        });

        const results = await Promise.all(promises);

        const realGames = _.filter(results, (game) => {
            return game.game.state !== 0;
        });

        return res
            .status(200)
            .json(realGames);

    } catch (e) {
        next(e);
    }
});

module.exports = headToHead;
