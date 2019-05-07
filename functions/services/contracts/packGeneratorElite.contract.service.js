const _ = require('lodash');

const {connectToElitePackGenerator} = require('../web3/networks');

const {
    ethnicityMapper,
    coloursMapper,
    kitsMapper,
    positionsMapper,
    nationalitiesMapper,
} = require("../../api/image/data/rarityMappers");

class PackGeneratorEliteContractService {

    async getRarities(network = 1) {
        // console.log(network);
        const generator = connectToElitePackGenerator(network);

        const allEthnicities = await generator.allEthnicities();
        const ethnicities = ethnicityMapper(allEthnicities[0]);

        const allColours = await generator.allColours();
        const colours = coloursMapper(allColours[0]);

        const allKits = await generator.allKits();
        const kits = kitsMapper(allKits[0]);

        const allPositions = await generator.allPositions();
        const positions = positionsMapper(allPositions[0]);

        const allNationalities = await generator.allNationalities();
        const nationalities = nationalitiesMapper(allNationalities[0]);

        return {
            ethnicities,
            kits,
            colours,
            positions,
            nationalities,
        };
    }


}

module.exports = new PackGeneratorEliteContractService();
