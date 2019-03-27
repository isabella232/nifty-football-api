const _ = require("lodash");

const {ethjsProvider} = require('../../services/web3/networks');

// FIXME refactor this to use web3 not ethjs

class BlockchainService {

    async getTransaction(network, txsHash) {
        console.log(`getting transaction on network [${network}]`, txsHash);
        return ethjsProvider(network).getTransactionByHash(txsHash)
            .then((result) => {
                if (!result) {
                    return result;
                }
                return {
                    ...result,
                    gas: result.gas.toNumber(),
                    gasPrice: result.gasPrice.toNumber(),
                    value: result.value.toNumber(),
                    transactionIndex: result.transactionIndex.toNumber(),
                    nonce: result.nonce.toNumber(),
                    blockNumber: result.blockNumber.toNumber()
                };
            });
    }

    async getTransactionReceipt(network, txsHash) {
        console.log(`Getting transaction receipt on network [${network}]`, txsHash);
        return ethjsProvider(network).getTransactionReceipt(txsHash)
            .then((result) => {
                if (!result) {
                    return result;
                }
                return {
                    ...result,
                    blockNumber: result.blockNumber.toNumber(),
                    cumulativeGasUsed: result.cumulativeGasUsed.toNumber(),
                    gasUsed: result.gasUsed.toNumber(),
                    transactionIndex: result.transactionIndex.toNumber(),
                };
            });
    }

    async getBlock(network, blockHashOrBlockNumber) {
        console.log(`Getting block on network [${network}]`, blockHashOrBlockNumber);
        const blockNumber = _.isNumber(blockHashOrBlockNumber);
        if (blockNumber) {
            return ethjsProvider(network).getBlockByNumber(blockHashOrBlockNumber, true);
        }
        return ethjsProvider(network).getBlockByHash(blockHashOrBlockNumber, true);
    }

    async getLatestBlockNumber(network) {
        console.log(`Getting last block on network [${network}]`);
        return ethjsProvider(network).getBlockByNumber("latest", true)
            .then((result) => {
                return result.number.toNumber();
            });
    }

    async getGasPrice(network) {
        console.log(`Getting gas price on network [${network}]`);
        return ethjsProvider(network).getGasPrice();
    }

    async resolveEnsName(network, ensNnme) {
        console.log(`Resolving address for ENS name on network [${network}]`, ensNnme);
        return ethjsProvider(network).resolveName(ensNnme);
    }

    async lookupAddress(network, address) {
        console.log(`Lookup ENS name for address on network [${network}]`, address);
        return ethjsProvider(network).lookupAddress(address);
    }
}

module.exports = new BlockchainService();
