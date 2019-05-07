const _ = require('lodash');

const squad = require('express').Router({mergeParams: true});

const {GOALKEEPER, STRIKER, MIDFIELDER, DEFENDER} = require('../image/data/positions').OPTIONS;

const cardService = require('../../services/data/cards.service');

squad.get('/:address/top', async (req, res, next) => {
    try {
        const {address, network} = req.params;

        const formation = {
            goalkeepers: 1,
            defence: 4,
            midfield: 4,
            strikers: 2
        };

        const goalkeepers = await cardService.getTopPlayersInPositionForAddress(network, address, GOALKEEPER, formation.keeper);
        const defence = await cardService.getTopPlayersInPositionForAddress(network, address, DEFENDER, formation.defence);
        const midfield = await cardService.getTopPlayersInPositionForAddress(network, address, MIDFIELDER, formation.midfield);
        const strikers = await cardService.getTopPlayersInPositionForAddress(network, address, STRIKER, formation.strikers);

        const topSquad = [
            ...goalkeepers,
            ...defence,
            ...midfield,
            ...strikers,
        ];

        const hasFullTeam = topSquad.length === 11;
        const hasEmptySquad = topSquad.length === 0;

        const squadTotal = hasFullTeam
            ? _.reduce(topSquad, (sum, value) => sum + value.attributeAvg, 0)
            : 0;

        const squadAverage = hasFullTeam
            ? Math.floor(squadTotal / 11)
            : 0;

        function complete(arr, val, length) {
            const oldLength = arr.length;
            arr.length = length;
            return _.fill(arr, {},  oldLength, arr.length);
        }

        return res
            .status(200)
            .json({
                owner: address,
                network: network,
                formation: formation,
                squadTotal: squadTotal,
                squadAverage: squadAverage,
                hasFullTeam: hasFullTeam,
                hasEmptySquad: hasEmptySquad,
                team: {
                    goalkeepers: complete(goalkeepers, {}, formation.goalkeepers),
                    defence: complete(defence, {}, formation.defence),
                    midfield: complete(midfield, {}, formation.midfield),
                    strikers: complete(strikers, {}, formation.strikers)
                }
            });
    } catch (e) {
        next(e);
    }
});

module.exports = squad;
