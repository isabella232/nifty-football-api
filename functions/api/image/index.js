const ethnicityService = require('../../services/ethnicity.service');
const kitService = require('../../services/kit.service');
const cheerioSVGService = require('../../services/cheerioSVGService.service');

const _ = require('lodash');

const headToHead = require('express').Router();

const generateSVG = () => {

    const ethnicity = ethnicityService.skinAndHair();
    const {kit, primary, secondary, tertiary} = kitService.kitAndColours();

    const idFills = {
        ...ethnicity,
        jersey: primary,
        verticalStripes: primary,
        collar: secondary,
        shorts: secondary,
        socks: secondary
    };

    switch (kit) {
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

headToHead.get('/card', async (req, res, next) => {
    try {
        const svg = generateSVG();
        // console.log(svg);
        res.contentType('image/svg+xml');
        return res.send(svg);
    } catch (e) {
        next(e);
    }
});

headToHead.get('/mockup', async (req, res, next) => {
    try {
        const svg = generateSVG();

        res.contentType('text/html');
        return res.send(cheerioSVGService.buildCard(svg));
    } catch (e) {
        next(e);
    }
});

module.exports = headToHead;
