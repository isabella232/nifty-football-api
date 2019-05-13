const _ = require('lodash');

const squad = require('express').Router({mergeParams: true});

const teamService = require('../../services/data/teams.service');

squad.get('/:address/top', async (req, res, next) => {
    try {
        const {address, network} = req.params;

        const data = teamService.getTopTeamForAddress(network, address);

        return res
            .status(200)
            .json(data);
    } catch (e) {
        next(e);
    }
});

squad.get(`/league`, async (req, res, next) => {
    try {
        const {network} = req.params;

        const data = teamService.getTopTeams(network);

        return res
            .status(200)
            .json(data);
    } catch (e) {
        next(e);
    }
});

module.exports = squad;
