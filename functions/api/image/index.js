const cheerioSVGService = require('../../services/cheerioSVGService.service');

const _ = require('lodash');

const headToHead = require('express').Router();

const generateSVG = ({nationality, ethnicity, kit, colour}) => {

    const ethnicityToken = require(`../../services/data/${nationality}/ethnicities`)[ethnicity];
    const kitToken = require(`../../services/data/kits`)[kit];
    const {primary, secondary, tertiary} = require(`../../services/data/colours`)[colour];

    const idFills = {
        ...ethnicity,
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


headToHead.get('/card', async (req, res, next) => {
    try {
        const svg = generateSVG(tokenValues);
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
