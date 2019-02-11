const futballcardsService = require('../services/futballcards.contract.service');


module.exports = {

    async tokenPointers(request, response) {

        const tokenId = request.params.tokenId;
        if (!tokenId) {
            return response.status(400).json({
                failure: `Token ID not provided`
            });
        }

        const network = request.params.network;
        if (!network) {
            return response.status(400).json({
                failure: `Network not provided`
            });
        }

        const pointers = await futballcardsService.tokenPointers(network);
        console.log(pointers);

        return response.status(200).json(pointers);
    },
};
