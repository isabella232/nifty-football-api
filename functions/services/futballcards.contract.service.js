const {connectToToken} = require('./abi/networks');

const axios = require('axios');

const lookupMetadata = async (tokenUri) => {
    const tokenMeta = await axios.get(tokenUri);
    const meta = tokenMeta.data;
    return {
        tokenUri,
        ...meta
    };
};

class FutballCardsContractService {

    async tokenBaseURI (network = 1) {
        console.log(`Find base token URI on network [${network}]`);

        const token = connectToToken(network);
        const tokenBaseURI = await token.tokenBaseURI();
        // console.log(tokenBaseURI);
        return tokenBaseURI;
    }

    async tokenPointers (network = 1) {
        const token = connectToToken(network);
        const totalCards = await token.totalCards();

        return {
            totalCards: totalCards[0]
        };
    }

    async tokenDetails (network = 1, tokenId) {
        console.log(`Find token details for [${tokenId}] on network [${network}]`);

        const token = connectToToken(network);

        // Get token attributes
        const {
            _cardType,
            _nationality,
            _position,
            _ethnicity,
            _kit,
            _colour
        } = await token.card(tokenId);

        const {
            _strength,
            _speed,
            _intelligence,
            _skill,
            _special,
            _firstName,
            _lastName
        } = await token.attributesAndName(tokenId);

        const {
            _badge,
            _sponsor,
            _number,
            _boots
        } = await token.extras(tokenId);

        const {
            _points,
            _stars
        } = await token.experience(tokenId);

        return {
            cardType: _cardType.toNumber(),
            nationality: _nationality.toNumber(),
            position: _position.toNumber(),
            ethnicity: _ethnicity.toNumber(),
            kit: _kit.toNumber(),
            colour: _colour.toNumber(),
            strength: _strength.toNumber(),
            speed: _speed.toNumber(),
            intelligence: _intelligence.toNumber(),
            skill: _skill.toNumber(),
            special: _special.toNumber(),
            firstName: _firstName.toNumber(),
            lastName: _lastName.toNumber(),
            badge: _badge.toNumber(),
            sponsor: _sponsor.toNumber(),
            number: _number.toNumber(),
            boots: _boots.toNumber(),
            points: _points.toNumber(),
            stars: _stars.toNumber()
        };
    }

}

module.exports = new FutballCardsContractService();
