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

        return res
            .status(200)
            .json({
                total: 0, // TODO show as zero if not got a full squad
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
