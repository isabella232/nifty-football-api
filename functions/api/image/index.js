const cheerioSVGService = require('../../services/cheerioSVGService.service');
const futballcardsService = require('../../services/futballcards.contract.service');

const _ = require('lodash');

const image = require('express').Router({mergeParams: true});

image.get('/xxx', async (req, res, next) => {
    try {

        const paramTokenValues = {
            nationality: 0,
            ethnicity:  Math.floor(Math.random() * 11),
            kit:  Math.floor(Math.random() * 10),
            colour:  Math.floor(Math.random() * 15),
        };

        const svg = cheerioSVGService.process(require('./svgString'), paramTokenValues);
        res.contentType('image/svg+xml');
        return res.send(svg);
    } catch (e) {
        next(e);
    }
});

image.get('/:tokenId', async (req, res, next) => {
    try {
        const tokenId = req.params.tokenId;
        const network = req.params.network;

        const tokenDetails = await futballcardsService.tokenDetails(network, tokenId);

        const svg = cheerioSVGService.process(require('./svgString'), tokenDetails);

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

image.get('/nationality/:nationality/ethnicity/:ethnicity/kit/:kit/colour/:colour', async (req, res, next) => {
    try {

        const paramTokenValues = {
            nationality: req.params.nationality,
            ethnicity: req.params.ethnicity,
            kit: req.params.kit,
            colour: req.params.colour,
        };

        const svg = cheerioSVGService.process(require('./svgString'), paramTokenValues);
        res.contentType('image/svg+xml');
        return res.send(svg);
    } catch (e) {
        next(e);
    }
});



module.exports = image;
