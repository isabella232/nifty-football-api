const _ = require('lodash');
const Web3 = require('web3');
const Eth = require('ethjs');
const {contracts, abi} = require('nifty-football-contract-tools');
const {getNetwork} = contracts;

const {INFURA_KEY} = require('../../constants');

function getHttpProviderUri(network) {
    if (_.toNumber(network) === 5777) {
        return 'http://127.0.0.1:7545'; // a.k.a. truffle
    }
    return `https://${getNetwork(network)}.infura.io/v3/${INFURA_KEY}`;
}

function getWebSocketProviderUri(network) {
    if (_.toNumber(network) === 5777) {
        return 'http://127.0.0.1:7545'; // a.k.a. truffle
    }
    return `https://${getNetwork(network)}.infura.io/v3/${INFURA_KEY}`;
}

const connectToToken = (network) => {
    return new Eth(new Eth.HttpProvider(getHttpProviderUri(network)))
        .contract(abi.FutballCardsAbi)
        .at(contracts.getNiftyFootballNft(network));
};

const connectToMarketplace = (network) => {
    return new Eth(new Eth.HttpProvider(getHttpProviderUri(network)))
        .contract(abi.BuyNowMarketplaceAbi)
        .at(contracts.getNiftyFootballMarketplace(network));
};

const connectToHeadToHeadGame = (network) => {
    return new Eth(new Eth.HttpProvider(getHttpProviderUri(network)))
        .contract(abi.HeadToHeadAbi)
        .at(contracts.getHeadToHeadGame(network));
};

const ethjsProvider = (network) => {
    return new Eth(new Eth.HttpProvider(getHttpProviderUri(network)));
};

const web3Provider = (network) => {
    return new Web3(new Web3.providers.WebsocketProvider(getWebSocketProviderUri(network)));
};

module.exports = {
    ethjsProvider,
    web3Provider,
    connectToToken,
    connectToHeadToHeadGame,
    connectToMarketplace
};
