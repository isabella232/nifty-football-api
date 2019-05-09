const _ = require('lodash');
const axios = require('axios');
const {contracts} = require('nifty-football-contract-tools');

const API_KEY = "35efb311299b4916a2361b8190054e60";

const getApi = (networkId) => {
    switch (_.toString(networkId)) {
        case '1':
            return 'https://api.opensea.io/api/v1';
        case '3':
            return 'https://rinkeby-api.opensea.io/api/v1';
        default:
            throw new Error(`Unhandled network - open sea only supports network ID 1 & 3 - provided [${networkId}]`);
    }
};

class OpenSeaService {

    refreshTokenMetaData(network, tokenId) {
        const {address} = contracts.getNiftyFootballNft(network);

        return axios
            .get(`${getApi(network)}/asset/${address}/${tokenId}/?force_update=true`, {
                'X-API-KEY': API_KEY
            })
            .then((result) => {
                return result.data;
            });
    }
}

module.exports = new OpenSeaService();
