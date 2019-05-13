const _ = require('lodash');

const firestore = require('./firebase.service').firestore();

const niftyFootballService = require('../contracts/niftyFootball.contract.service');
const {getNetwork} = require('nifty-football-contract-tools').contracts;

const cardService = require('./cards.service');
const {GOALKEEPER, STRIKER, MIDFIELDER, DEFENDER} = require('../../api/image/data/positions').OPTIONS;

const DEFAULT_FORMATION = {
    goalkeepers: 1,
    defence: 4,
    midfield: 4,
    strikers: 2
};

class TeamsService {

    async refreshTopTeamForAddress(network, address) {
        console.log(`Refreshing top team for address [${address}] on [${network}]`);

        const goalkeepers = await cardService.getTopPlayersInPositionForAddress(network, address, GOALKEEPER, DEFAULT_FORMATION.goalkeepers);
        const defence = await cardService.getTopPlayersInPositionForAddress(network, address, DEFENDER, DEFAULT_FORMATION.defence);
        const midfield = await cardService.getTopPlayersInPositionForAddress(network, address, MIDFIELDER, DEFAULT_FORMATION.midfield);
        const strikers = await cardService.getTopPlayersInPositionForAddress(network, address, STRIKER, DEFAULT_FORMATION.strikers);

        const topSquad = [
            ...goalkeepers,
            ...defence,
            ...midfield,
            ...strikers,
        ];

        const squadSize = topSquad.length;
        const hasFullTeam = squadSize === 11;
        const hasEmptySquad = squadSize === 0;

        const squadTotal = getSquadTotal(hasFullTeam, topSquad);

        const squad = {
            owner: address,
            network: network,
            formation: DEFAULT_FORMATION,
            squadTotal: squadTotal,
            squadAverage: getSquadAverage(hasFullTeam, squadTotal, squadSize),
            squadSize: squadSize,
            hasFullTeam: hasFullTeam,
            hasEmptySquad: hasEmptySquad,
            lastRefreshedDate: Date.now(),
            team: {
                goalkeepers: fillPosition(_.map(goalkeepers, 'tokenId'), DEFAULT_FORMATION.goalkeepers, 0),
                defence: fillPosition(_.map(defence, 'tokenId'), DEFAULT_FORMATION.defence, 0),
                midfield: fillPosition(_.map(midfield, 'tokenId'), DEFAULT_FORMATION.midfield, 0),
                strikers: fillPosition(_.map(strikers, 'tokenId'), DEFAULT_FORMATION.strikers, 0)
            }
        };

        return firestore
            .collection(`top-team`)
            .doc(getNetwork(network))
            .collection(`address`)
            .doc(address)
            .set(squad)
            .then(() => {
                return squad;
            });
    }

    async refreshTopTeamForTokenOwner(network, tokenId) {
        console.log(`Refreshing top team for owner of token [${tokenId}] on [${network}]`);
        const owner = await niftyFootballService.ownerOf(network, tokenId);
        if (!owner) {
            console.error(`Owner not found for token ID [${tokenId}] on network [${network}]`);
            return;
        }
        return this.refreshTopTeamForAddress(network, owner);
    }

    async getTopTeams(network, limit = 25) {
        return firestore
            .collection(`top-team`)
            .doc(getNetwork(network))
            .orderBy('squadAverage', 'desc')
            .limit(limit)
            .get()
            .then((querySet) => {
                const team = new Set();
                querySet.forEach((doc) => {
                    team.add(doc.data());
                });
                return Array.from(team);
            });
    }

    async getTopTeamForAddress(network, address) {
        const topTeam = await firestore
            .collection(`top-team`)
            .doc(getNetwork(network))
            .collection(`address`)
            .doc(address)
            .get();

        const getPlayer = async (tokenId) => {
            if (tokenId === 0) {
                return {};
            }
            return await cardService.getCardById(network, tokenId);
        };

        // Explode out each team to be the fully populated objects
        topTeam.team = {
            goalkeepers: fillPosition(_.map(topTeam.team.goalkeepers, getPlayer), DEFAULT_FORMATION.goalkeepers, {}),
            defence: fillPosition(_.map(topTeam.team.defence, getPlayer), DEFAULT_FORMATION.defence, {}),
            midfield: fillPosition(_.map(topTeam.team.midfield, getPlayer), DEFAULT_FORMATION.midfield, {}),
            strikers: fillPosition(_.map(topTeam.team.strikers, getPlayer), DEFAULT_FORMATION.strikers, {})
        };

        return topTeam;
    }
}

const fillPosition = (arr, length, padValue = {}) => {
    const oldLength = arr.length;
    arr.length = length;
    return _.fill(arr, padValue, oldLength, arr.length);
};


const getSquadTotal = (hasFullTeam, topSquad) => {
    return hasFullTeam
        ? _.reduce(topSquad, (sum, value) => sum + value.attributeAvg, 0)
        : 0;
};

const getSquadAverage = (hasFullTeam, squadTotal, expectedSize = 11) => {
    return hasFullTeam
        ? Math.floor(squadTotal / expectedSize)
        : 0;
};

module.exports = new TeamsService();
