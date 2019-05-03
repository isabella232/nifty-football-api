const _ = require('lodash');

const squad = require('express').Router({mergeParams: true});

const {GOAL_KEEPER, STRIKER, MIDFIELDER, DEFENDER} = require('../image/data/positions').OPTIONS;


const carrdService = require('../../services/data/cards.service');

squad.get('/:address/top', async (req, res, next) => {
    try {
        const {address, network} = req.params;

        const formation = {
            keeper: 1,
            defence: 4,
            midfield: 4,
            strikers: 2
        };

        const keeper = await carrdService.getTopPlayersInPositionForAddress(network, address, GOAL_KEEPER, formation.keeper);

        const defence = await carrdService.getTopPlayersInPositionForAddress(network, address, DEFENDER, formation.defence);

        const midfield = await carrdService.getTopPlayersInPositionForAddress(network, address, MIDFIELDER, formation.midfield);

        const strikers = await carrdService.getTopPlayersInPositionForAddress(network, address, STRIKER, formation.strikers);

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

        const squadAverage = hasFullSquad
            ? Math.floor(squadTotal / 11)
            : 0;

        return res
            .status(200)
            .json({
                owner: address,
                network: network,
                formation: formation,
                squadTotal: squadTotal,
                squadAverage: squadAverage,
                team: {
                    keeper: _.size(keeper) === 1 ? keeper[0] : {},
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
