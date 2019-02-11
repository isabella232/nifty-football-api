const futballcardsService = require('../../services/futballcards.contract.service');

const token = require('express').Router();

token.get('/token/pointers', async (req, res, next) => {
    try {
        const network = request.params.network;

        const pointers = await futballcardsService.tokenPointers(network);
        console.log(pointers);

        return res.status(200).json(pointers);
    } catch (e) {
        next(e);
    }
});

token.get('/token/:tokenId', async (req, res, next) => {
    try {
        const tokenId = request.params.tokenId;
        const network = request.params.network;

        const pointers = await futballcardsService.tokenDetails(network, tokenId);
        console.log(pointers);

        return res.status(200).json(pointers);
    } catch (e) {
        next(e);
    }
});

module.exports = token;
