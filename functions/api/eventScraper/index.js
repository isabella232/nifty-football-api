const _ = require('lodash');

const mapper = require('./mapper');
const {getContractForNetworkAndAddress} = require('nifty-football-contract-tools');

const {web3Provider} = require('../../services/web3/networks');

const blockProcessingService = require('../../services/data/blockProcessingService');
const eventsStoreService = require('../../services/data/eventsStore.service');

const eventScrapper = require('express').Router({mergeParams: true});

eventScrapper.get('/events/:address', async (request, response) => {
    try {
        const {address, abi, network, deploymentBlock} = getContractForNetworkAndAddress(request.params.network, request.params.address);

        const provider = web3Provider(network);

        const latestBlock = await provider.eth.getBlockNumber();

        // Moving pointer approx 12 blocks behind the main chain to prevent chain re-orgs
        const numberOfConfirmations = 12;
        const blockMinusConfirmations = latestBlock - numberOfConfirmations;
        console.log(`Event Scrapper - using block [${blockMinusConfirmations}] which is [${numberOfConfirmations}] behind network [${network}] which is [${latestBlock}]`);

        const flow = blockProcessingService.getEventScrapperFlow(network, address, deploymentBlock);

        const lastProcessedBlock = await flow.getLastBlock();
        console.log(`Event Scrapper - last processed block [${lastProcessedBlock}] for network [${network}]`);

        // handle catching up the latest block number
        const toBlock = lastProcessedBlock + 10000 > blockMinusConfirmations
            ? blockMinusConfirmations
            : lastProcessedBlock + 10000;

        const WatchingContract = provider.eth.Contract(abi, address);

        // Get the next set of events
        const events = await WatchingContract.getPastEvents('allEvents', {
            fromBlock: lastProcessedBlock,
            toBlock: toBlock
        });

        console.log(`Event Scrapper - found a total of [${events.length}] events from [${lastProcessedBlock}] to [${toBlock}]`);

        // Process them all
        const promises = events.map(async event => {
            const block = await provider.eth.getBlock(event.blockNumber);

            // TODO add USD price

            const mappedEvent = mapper(event, block);
            return eventsStoreService.upsertEvent(network, mappedEvent);
        });

        // Write them all to the DB
        await Promise.all(promises);

        // Update block pointer
        await flow.updateLastBlockProcessed({lastBlock: toBlock});

        // Success!
        return response
            .status(202)
            .send("OK");

    } catch (e) {
        console.log('Error ', e.message);
        response
            .status(500)
            .json({message: e.message});
    }
});

module.exports = eventScrapper;
