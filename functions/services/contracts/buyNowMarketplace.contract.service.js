const {connectToMarketplace} = require('../web3/networks');
const futballCardsContractService = require('./futballcards.contract.service');

const axios = require('axios');

class BuyNowMarketplaceContractService {

    async listedCards (network = 1) {
        console.log(network);
        const marketplace = connectToMarketplace(network);
        const ids = await marketplace.listedTokens();

        return {
            tokenIds: ids
        };
    }
}

module.exports = new BuyNowMarketplaceContractService();
