const openSeaService = require('../functions/services/data/openSea.service');

const wait = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 250);
    });
};

void async function () {

    const NETWORK = 1;

    for (let i = 14; i <= 1000; i++) {
        await openSeaService.refreshTokenMetaData(NETWORK, i);
        // await wait();
        console.log(`Refreshed token ID [${i}]`);
    }

}();
