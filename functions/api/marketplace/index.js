const _ = require('lodash');

const marketplaceContractService = require('../../services/contracts/buyNowMarketplace.contract.service');

const marketplace = require('express').Router({mergeParams: true});

marketplace.get('/listed', async (req, res, next) => {
    try {
        const network = req.params.network;

        const listedData = await marketplaceContractService.listedCards(network);

        return res.status(200).json(listedData);
    } catch (e) {
        next(e);
    }
});

module.exports = marketplace;
