const _ = require('lodash');

const rarities = require('express').Router({mergeParams: true});

const packGeneratorRegularService = require('../../services/contracts/packGeneratorRegular.contract.service');
const packGeneratorEliteService = require('../../services/contracts/packGeneratorElite.contract.service');

rarities.get('/packs', async (req, res, next) => {
    try {
        const network = req.params.network;

        const regular = await packGeneratorRegularService.getRarities(network);
        const elite = await packGeneratorEliteService.getRarities(network);

        return res
            .status(200)
            .json({
                regular: {
                    ...regular
                },
                elite: {
                    ...elite
                }
            });
    } catch (e) {
        next(e);
    }
});

module.exports = rarities;
