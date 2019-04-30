const _ = require('lodash');

const cardsService = require('../../services/data/cards.service');

const activity = require('express').Router({mergeParams: true});

activity.get('/latest/cards', async (req, res, next) => {
    try {
        const limit = _.get(req.query, 'limit', 25);
        const network = req.params.network;

        const data = await cardsService.latestCards(network, limit);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
});

module.exports = activity;
