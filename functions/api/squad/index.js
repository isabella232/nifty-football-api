const _ = require('lodash');

const squad = require('express').Router({mergeParams: true});

const {GOAL_KEEPER, STRIKER, MIDFIELDER, DEFENDER} = require('../../services/images/data/positions').OPTIONS;


const carrdService = require('../../services/data/cards.service');

squad.get('/:address/top', async (req, res, next) => {
    try {
        const {address, network} = req.params;

        const keeper = await carrdService.getTopPlayerInPositionForAddress(network, address, GOAL_KEEPER, 1);

        const defence = await carrdService.getTopPlayerInPositionForAddress(network, address, DEFENDER, 4);

        const midfield = await carrdService.getTopPlayerInPositionForAddress(network, address, MIDFIELDER, 4);

        const strikers = await carrdService.getTopPlayerInPositionForAddress(network, address, STRIKER, 2);

        const topSquad = [
            ...keeper,
            ...defence,
            ...midfield,
            ...strikers,
        ];

        const hasFullSquad = topSquad.length === 11;

        const squadTotal = hasFullSquad
            ? _.reduce(topSquad, (sum, value) => sum + value.attributeAvg, 0)
            : 0;

        return res
            .status(200)
            .json({
                total: squadTotal,
                team: {
                    keeper: keeper,
                    defence: defence,
                    midfield: midfield,
                    strikers: strikers
                }
            });
    } catch (e) {
        next(e);
    }
});

module.exports = squad;
