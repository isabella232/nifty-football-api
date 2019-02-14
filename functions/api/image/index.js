const cheerioSVGService = require('../../services/cheerioSVGService.service');
const futballcardsService = require('../../services/futballcards.contract.service');

const _ = require('lodash');

const headToHead = require('express').Router();

const generateSVG = ({nationality, ethnicity, kit, colour}) => {

    const {skin, hair} = require(`../../services/data/${nationality}/ethnicities`)[ethnicity];
    const kitToken = require(`../../services/data/kits`)[kit];
    const {primary, secondary, tertiary} = require(`../../services/data/colours`)[colour];

    const idFills = {
        skin: skin[0],
        hair: hair[0],
        jersey: primary,
        verticalStripes: primary,
        collar: secondary,
        shorts: secondary,
        socks: secondary
    };

    switch (kitToken) {
        case 'classic':
            break;
        case 'striped':
            idFills.verticalStripes = secondary;
            break;
        case 'mixed':
            idFills.collar = tertiary;
            idFills.verticalStripes = secondary;
            idFills.socks = tertiary;
            break;
        case 'tri':
            idFills.collar = tertiary;
            idFills.shorts = secondary;
            idFills.socks = tertiary;
            break;
        case 'one-tone':
            idFills.collar = primary;
            idFills.shorts = primary;
            idFills.socks = primary;
            break;
        default:
    }

    return cheerioSVGService.process(
        require('./svgString'),
        idFills
    );
};

// these will come from the TOKEN eventually...
const tokenValues = {
    nationality: 1,
    ethnicity: 2,
    kit: 2,
    colour: 5,
    firstName: 0,
    lastName: 0,
    attributeAverage: 77
};


headToHead.get('/:tokenId', async (req, res, next) => {
    try {
        // const tokenId = req.params.tokenId;
        const tokenId = 4;
        // const network = req.params.network;
        const network = 5777;

        const tokenDetails = await futballcardsService.tokenDetails(network, tokenId);

        const svg = generateSVG(tokenDetails);
        // console.log(svg);
        res.contentType('image/svg+xml');
        return res.send(svg);
    } catch (e) {
        next(e);
    }
});

headToHead.get('/mockup', async (req, res, next) => {
    try {


        const svg = generateSVG(tokenValues);

        const nationalityText = require(`../../services/data/nationalities`)[tokenValues.nationality];
        const firstNameText = require(`../../services/data/${tokenValues.nationality}/firstNames`)[tokenValues.firstName];
        const lastNameText = require(`../../services/data/${tokenValues.nationality}/lastNames`)[tokenValues.lastName];
        const attributeAverage = tokenValues.attributeAverage;

        res.contentType('text/html');
        return res.send(cheerioSVGService.buildCard(svg, {
            nationalityText,
            firstNameText,
            lastNameText,
            attributeAverage
        }));
    } catch (e) {
        next(e);
    }
});

module.exports = headToHead;
