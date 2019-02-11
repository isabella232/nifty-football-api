const _ = require('lodash');

const headToHeadGameService = require('../../../services/games/headToHeadGame.service');

const headToHead = require('express').Router();

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

module.exports = headToHead;
