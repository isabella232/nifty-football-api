const cheerioSVGService = require('../../services/cheerioSVGService.service');
const futballcardsService = require('../../services/futballcards.contract.service');

const _ = require('lodash');

const image = require('express').Router({mergeParams: true});

const generateSVG = ({nationality, ethnicity, kit, colour}) => {

    const {skin, hair, beard} = require(`../../services/data/${nationality}/ethnicities`)[ethnicity];
    const kitToken = require(`../../services/data/kits`)[kit];
    const {primary, secondary, tertiary} = require(`../../services/data/colours`)[colour];

    const idFills = {
        skin: skin[0],
        hair: hair[0],
        beard: beard[0],
        jersey: primary,
        verticalStripes: primary,
        collar: secondary,
        shorts: secondary,
        socks: secondary,
        shirtTrim: secondary,
        shortsTrimMiddle: secondary,
        sockTrim: secondary,
        sockTopTrim: primary,
        hoops: secondary
    };

    const opacityFills = {
        topHoop: 0,
        centerHoop: 0,
        bottomHoop: 0,
        hair: hair[1],
        beard: beard[1]
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
            idFills.collar = primary;
            idFills.shorts = primary;
            idFills.socks = primary;
            idFills.shirtTrim = primary;
            idFills.shortsTrimMiddle = primary;
            idFills.sockTrim = primary;
            idFills.sockTopTrim = primary;
            break;
        case 'one-hoop':
            opacityFills.centerHoop = 1;
            break;
        case 'tri-hoop':
            opacityFills.topHoop = 1;
            opacityFills.centerHoop = 1;
            opacityFills.bottomHoop = 1;
            break;
        case 'all-trim':
            idFills.shirtTrim = secondary;
            idFills.shortsTrimMiddle = primary;
            idFills.sockTrim = primary;
            idFills.sockTopTrim = primary;
            break;
        case 'classic-sock-band':
            idFills.collar = primary;
            idFills.shirtTrim = primary;
            idFills.shortsTrimMiddle = secondary;
            idFills.sockTrim = primary;
            idFills.sockTopTrim = secondary;
            break;
        case 'top-hoop':
            opacityFills.topHoop = 1;
            opacityFills.centerHoop = 0;
            opacityFills.bottomHoop = 0;
            break;
        default:
    }

    return cheerioSVGService.process(
        require('./svgString'),
        idFills,
        opacityFills
    );
};

image.get('/:tokenId', async (req, res, next) => {
    try {
        const tokenId = req.params.tokenId;
        const network = req.params.network;

        const tokenDetails = await futballcardsService.tokenDetails(network, tokenId);

        const svg = generateSVG(tokenDetails);
        // console.log(svg);
        res.contentType('image/svg+xml');
        return res.send(svg);
    } catch (e) {
        next(e);
    }
});

image.get('/mockup', async (req, res, next) => {
    try {

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

image.get('/nationality/:nationality/ethnicity/:ethnicity/kit/:kit/colour/:colour/firstName/:firstName/lastName/:lastName/attributeAverage/:attributeAverage', async (req, res, next) => {
    try {

        const paramTokenValues = {
            nationality: req.params.nationality,
            ethnicity: req.params.ethnicity,
            kit: req.params.kit,
            colour: req.params.colour,
            firstName: req.params.firstName,
            lastName: req.params.lastName,
            attributeAverage: req.params.attributeAverage
        };

        const svg = generateSVG(paramTokenValues);

        const nationalityText = require(`../../services/data/nationalities`)[paramTokenValues.nationality];
        const firstNameText = require(`../../services/data/${paramTokenValues.nationality}/firstNames`)[paramTokenValues.firstName];
        const lastNameText = require(`../../services/data/${paramTokenValues.nationality}/lastNames`)[paramTokenValues.lastName];
        const attributeAverage = paramTokenValues.attributeAverage;

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

module.exports = image;
