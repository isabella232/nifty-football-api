const futballcardsService = require('../../services/futballcards.contract.service');

const token = require('express').Router({mergeParams: true});

token.get('/pointers', async (req, res, next) => {
    try {
        const network = req.params.network;

        const pointers = await futballcardsService.tokenPointers(network);

        return res.status(200).json(pointers);
    } catch (e) {
        next(e);
    }
});

token.get('/:tokenId', async (req, res, next) => {
    try {
        const tokenId = req.params.tokenId;
        const network = req.params.network;

        const tokenDetails = await futballcardsService.tokenDetails(network, tokenId);

        return res.status(200).json(tokenDetails);
    } catch (e) {
        next(e);
    }
});

module.exports = token;
