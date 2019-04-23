const _ = require('lodash');
const Eth = require('ethjs');

const niftyFootballService = require('../../services/contracts/niftyFootball.contract.service');
const blockchainService = require('../../services/web3/blockchain.service');

const {abi} = require('nifty-football-contract-tools');

const txs = require('express').Router({mergeParams: true});

txs.get('/mints/:transactionId/cards', async (req, res, next) => {
    try {
        const network = req.params.network;
        const transactionId = req.params.transactionId;

        const results = await blockchainService.getTransactionReceipt(network, transactionId);
        if (!results) {
            return res.status(200).json({
                success: false,
                txsNotFound: true,
                transactionId,
                network
            });
        }

        // Decode the logs
        const decoder = Eth.abi.logDecoder(abi.FutballCardsAbi);
        const events = decoder(results.logs);

        // Filter on mints
        const mints = _.filter(events, ({_eventName}) => {
            return _eventName === 'CardMinted';
        });

        // Lookup cards
        const cards = await Promise.all(_.map(mints, ({_tokenId}) => {
            return niftyFootballService.tokenDetails(network, _tokenId);
        }));

        const currentBlockNumber = await blockchainService.getLatestBlockNumber(network);

        return res
            .status(200)
            .json({
                success: results.status === '0x1', // 0x1 == status, 0x0 == status
                confirmations: results.blockNumber !== null ? currentBlockNumber - results.blockNumber : 0,
                transactionId,
                network,
                cards: cards
            });
    } catch (e) {
        next(e);
    }
});

module.exports = txs;
