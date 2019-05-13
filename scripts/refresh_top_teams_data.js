const _ = require('lodash');
const program = require('commander');
const {contracts} = require('nifty-football-contract-tools');

const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(require("../functions/_keys/futbol-cards-firebase-adminsdk.json")),
    databaseURL: 'https://futbol-cards.firebaseio.com'
});

const wait = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 250);
    });
};

void async function () {
    ////////////////////////////////
    // The network to run against //
    ////////////////////////////////

    program
        .option('-n, --network <n>', 'Network - either 1,3,4,5777', parseInt)
        .parse(process.argv);

    if (!program.network) {
        console.log(`Please specify --network=1, 3, 4 or 5777`);
        process.exit();
    }

    const network = contracts.getNetwork(program.network);

    require('../functions/services/data/firebase.service').firestore(admin);

    const teamsService = require('../functions/services/data/teams.service');
    const niftyContractService = require('../functions/services/contracts/niftyFootball.contract.service');

    const tokenIdPointer = await niftyContractService.tokenIdPointer();

    const owners = new Set();

    for (let i = 1; i <= tokenIdPointer; i++) {
        const owner = await niftyContractService.ownerOf(network, i);
        owners.add(owner);
    }

    console.log(owners);

    for (let owner in owners) {
        await teamsService.refreshTopTeamForTokenOwner(network, owner);
    }

}();
