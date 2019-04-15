const _ = require('lodash');

const squad = require('express').Router({mergeParams: true});

squad.get('/:address/top', async (req, res, next) => {
    try {
        const {address, network} = req.params;

        // TODO get top squad for address, grouped by position


        return res.status(200).json({
            total: 0, // show as zero if not got a full squad
            team: {
                keeper: {},
                defence: [],
                midfield: [],
                forwards: []
            }
        });
    } catch (e) {
        next(e);
    }
});

module.exports = squad;
