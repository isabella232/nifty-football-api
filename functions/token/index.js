const futballcardsService = require('../services/futballcards.contract.service');



module.exports = {

    async tokenPointers(request, response) {
        const network = request.params.network;

        const pointers = await futballcardsService.tokenPointers(network);
        console.log(pointers);

        return response.status(200).json(pointers);
    },

    async tokenDetails(request, response) {

        const tokenId = request.params.tokenId;
        const network = request.params.network;

        const pointers = await futballcardsService.tokenDetails(network, tokenId);
        console.log(pointers);

        return response.status(200).json(pointers);
    },
};
