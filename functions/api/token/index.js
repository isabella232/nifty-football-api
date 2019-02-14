const futballcardsService = require('../../services/futballcards.contract.service');

const token = require('express').Router();

token.get('/pointers', async (req, res, next) => {
    try {
        console.log(`REQ`, req.params);
        // const network = req.params.network;
        const network = 5777;

        const pointers = await futballcardsService.tokenPointers(network);

        return res.status(200).json(pointers);
    } catch (e) {
        next(e);
    }
});

token.get('/:tokenId', async (req, res, next) => {
    try {
        // const tokenId = req.params.tokenId;
        const tokenId = 0;
        // const network = req.params.network;
        const network = 5777;

        const tokenDetails = await futballcardsService.tokenDetails(network, tokenId);

        return res.status(200).json(tokenDetails);
    } catch (e) {
        next(e);
    }
});

module.exports = token;
