const _ = require('lodash');

const {connectToToken} = require('../web3/networks');
const nations = require('../../api/image/data/nations');
const positions = require('../../api/image/data/positions').LOOKUP;

const kits = require(`../../api/image/data/kits`);
const colours = require(`../../api/image/data/colours`);

const {
    specialMapper,
    bootsMapper,
    badgeMapper,
    numberMapper,
    sponsorMapper,
    backgroundColourMapper
} = require("../../api/image/data/mappers");

class NiftyFootballContractService {

    async tokenPointers(network = 1) {
        console.log(network);
        const token = connectToToken(network);
        const totalCards = await token.totalCards();

        return {
            totalCards: totalCards[0]
        };
    }

    async tokenDetails(network = 1, tokenId) {
        console.log(`Find token details for [${tokenId}] on network [${network}]`);

        const token = connectToToken(network);

        // Get token attributes
        const {
            cardType,
            nationality,
            nationalityText,
            position,
            positionText,
            positionName,
            ethnicity,
            ethincityText,
            kit,
            kitName,
            kitText,
            colour,
            colourName,
            colourText,
        } = await NiftyFootballContractService._getCardDetail(token, tokenId);

        const {
            strength,
            speed,
            intelligence,
            skill,
            attributeAvg,
            special,
            specialName,
            firstName,
            lastName,
            fullName,
        } = await NiftyFootballContractService._getAttributesAndName(token, tokenId, nationality);

        const {
            badge,
            sponsor,
            number,
            boots,
            badgeName,
            sponsorName,
            numberName,
            bootsName
        } = await NiftyFootballContractService._getExtras(token, tokenId);

        const owner = await token.ownerOf(tokenId);

        return {
            // Defaults
            owner: owner[0],
            tokenId: parseInt(tokenId),

            // Card details
            cardType,
            nationality,
            nationalityText,
            position,
            positionText,
            positionName,
            ethnicity,
            ethincityText,
            kit,
            kitText,
            kitName,
            colour,
            colourText,
            colourName,

            // Attributes
            strength,
            speed,
            intelligence,
            skill,
            attributeAvg,
            special,
            specialName,
            firstName,
            lastName,
            fullName,

            // Extras
            badge,
            sponsor,
            number,
            boots,
            badgeName,
            sponsorName,
            numberName,
            bootsName
        };
    }

    async tokenMetaData(network = 1, tokenId) {
        console.log(`Find token details for [${tokenId}] on network [${network}]`);

        const token = connectToToken(network);

        // Get token attributes
        const {
            nationality,
            nationalityText,
            positionText,
            ethnicity,
            kitText,
            colourText,
        } = await NiftyFootballContractService._getCardDetail(token, tokenId);

        const {
            strength,
            intelligence,
            skill,
            attributeAvg,
            specialName,
            fullName,
        } = await NiftyFootballContractService._getAttributesAndName(token, tokenId, nationality);

        const {
            badgeName,
            sponsorName,
            numberName,
            bootsName
        } = await NiftyFootballContractService._getExtras(token, tokenId);

        return {
            name: fullName,
            description: `${fullName} is a ${_.lowerCase(positionText)} from ${nationalityText} playing in the ${kitText} kit`,
            image: `https://niftyfootball.cards/api/network/${network}/image/${tokenId}`,
            secondary_image: `https://niftyfootball.cards/api/network/${network}/image/${tokenId}/back`,
            external_url: "https://niftyfootball.cards",
            background_color: backgroundColourMapper(nationality).hex,
            attributes: [
                {
                    trait_type: "nationality",
                    value: nationalityText
                },
                {
                    trait_type: "colour",
                    value: colourText
                },
                {
                    display_type: "number",
                    trait_type: "card_type",
                    value: 0
                },
                {
                    trait_type: "position",
                    value: positionText
                },
                {
                    trait_type: "kit",
                    value: kitText
                },
                {
                    trait_type: "ethnicity",
                    value: `${nationalityText} #${ethnicity}`
                },
                {
                    display_type: "boost_percentage",
                    trait_type: "strength",
                    value: strength,
                    max_value: 100
                },
                {
                    display_type: "boost_percentage",
                    trait_type: "speed",
                    value: strength,
                    max_value: 100
                },
                {
                    display_type: "boost_percentage",
                    trait_type: "intelligence",
                    value: intelligence,
                    max_value: 100
                },
                {
                    display_type: "boost_percentage",
                    trait_type: "skill",
                    value: skill,
                    max_value: 100
                },
                {
                    display_type: "boost_percentage",
                    trait_type: "average",
                    value: attributeAvg,
                    max_value: 100
                },
                {
                    trait_type: "boots",
                    value: bootsName
                },
                {
                    trait_type: "badge",
                    value: badgeName
                },
                {
                    trait_type: "sponsor",
                    value: sponsorName
                },
                {
                    trait_type: "number",
                    value: numberName
                },
                {
                    trait_type: "special",
                    value: specialName
                }
            ],
        };
    }

    async accountTokenDetails(network = 1, address) {
        console.log(`Get account token details [${address}] on network [${network}]`);

        const token = connectToToken(network);

        const tokens = await token.tokensOfOwner(address);

        return {
            tokenIds: tokens[0].map(id => id.toNumber())
        };
    }

    async contractInfo(network = 1) {
        console.log(`Get contract info on network [${network}]`);

        const token = connectToToken(network);

        const totalSupply = await token.totalSupply();
        const symbol = await token.symbol();
        const name = await token.name();

        return {
            totalSupply: totalSupply[0].toNumber(),
            symbol: symbol[0],
            name: name[0]
        };
    }

    static async _getCardDetail(tokenContract, tokenId) {

        const {
            _cardType,
            _nationality,
            _position,
            _ethnicity,
            _kit,
            _colour
        } = await tokenContract.card(tokenId);

        const colour = _colour.toNumber();
        const kit = _kit.toNumber();
        const nationality = _nationality.toNumber();
        const ethnicity = _ethnicity.toNumber();
        const position = _position.toNumber();

        const kitName = kits[kit].name;
        const kitText = _.split(kitName, "_").join(" ");
        const colourName = colours[colour].name;
        const colourText = _.capitalize(_.split(colourName, "_").join(" "));

        return {
            cardType: _cardType.toNumber(),
            nationality: nationality,
            nationalityText: `${nations[nationality].name}`,
            position: position,
            positionName: positions[position],
            positionText: _.capitalize(positions[position]),
            ethnicity: ethnicity,
            kit: kit,
            kitName: kitName,
            kitText: kitText,
            colour: colour,
            colourText: colourText,
            colourName: colourName
        };
    }

    static async _getAttributesAndName(tokenContract, tokenId, nationality) {
        const {
            _strength,
            _speed,
            _intelligence,
            _skill,
            _special,
            _firstName,
            _lastName
        } = await tokenContract.attributesAndName(tokenId);

        const firstName = _firstName.toNumber();
        const lastName = _lastName.toNumber();

        const strength = _strength.toNumber();
        const speed = _speed.toNumber();
        const intelligence = _intelligence.toNumber();
        const skill = _skill.toNumber();

        const special = _special.toNumber();
        return {
            strength: strength,
            speed: speed,
            intelligence: intelligence,
            skill: skill,
            attributeAvg: Math.floor((strength + speed + intelligence + skill) / 4),
            special: special,
            specialName: specialMapper(special),
            firstName: firstName,
            lastName: lastName,
            fullName: `${_.capitalize(nations[nationality].firstNames[firstName].latin)} ${_.capitalize(nations[nationality].lastNames[lastName].latin)}`,
        };
    }

    static async _getExtras(tokenContract, tokenId) {
        const {
            _badge,
            _sponsor,
            _number,
            _boots
        } = await tokenContract.extras(tokenId);

        const badge = _badge.toNumber();
        const sponsor = _sponsor.toNumber();
        const number = _number.toNumber();
        const boots = _boots.toNumber();

        return {
            badge: badge,
            badgeName: badgeMapper(badge),

            sponsor: sponsor,
            sponsorName: sponsorMapper(sponsor),

            number: number,
            numberName: numberMapper(number),

            boots: boots,
            bootsName: bootsMapper(boots),
        };
    }
}

module.exports = new NiftyFootballContractService();
