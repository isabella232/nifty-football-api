const _ = require('lodash');
const database = require('./firebase.service').database();

const {contracts} = require('nifty-football-contract-tools');

/**
 * Basic wrapper class that can manage a firebase database connection, also providing block based step conditions
 */
class BlockProcessingFlow {
    constructor({_network, _rootPath, _deploymentBlock}) {
        this.network = contracts.getNetwork(_network);
        this.rootPath = _rootPath;
        this.deploymentBlock = _deploymentBlock;
    }

    async getLastBlock() {
        return database.ref(`${this.rootPath}/${this.network}`)
            .once('value')
            .then((snapshot) => {
                let data = snapshot.val();
                return _.get(data, 'lastBlock', this.deploymentBlock);
            });
    }

    async clearLastBlock() {
        return database.ref(`${this.rootPath}/${this.network}`).set(null);
    }

    async updateLastBlockProcessed({lastBlock}) {
        console.log(`Updating last block processed to [${lastBlock}] for network [${this.network}]`);
        return database.ref(`${this.rootPath}/${this.network}`).set({lastBlock});
    }

    getRootPath() {
        return this.rootPath;
    }
}

module.exports = {
    getEventScrapperFlow: (network, contractAddress, deploymentBlock) =>
        new BlockProcessingFlow({
            _network: network,
            _deploymentBlock: deploymentBlock,
            _rootPath: `event-scrapper-${contractAddress}`
        }),
};
