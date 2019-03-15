const cheerioSVGService = require('../../services/cheerioSVGService.service');
const futballcardsService = require('../../services/futballcards.contract.service');

const ethnicities = require('../../services/data/ethnicities');
const kits = require('../../services/data/kits');
const colours = require('../../services/data/colours');

const _ = require('lodash');

const image = require('express').Router({mergeParams: true});

image.get('/xxx', async (req, res, next) => {
    try {

        const paramTokenValues = {
            nationality: 0,
            ethnicity: Math.floor(Math.random() * 11),
            kit: Math.floor(Math.random() * 24),
            colour: Math.floor(Math.random() * 17),
        };

        const svg = cheerioSVGService.process(require('./svgString'), paramTokenValues);
        res.contentType('image/svg+xml');
        return res.send(svg);
    } catch (e) {
        next(e);
    }
});

image.get('/data', async (req, res, next) => {
    try {

        return res.status(200).json({
            ethnicities: ethnicities,
            kits: kits,
            colours: colours,
        });
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

image.get('/ethnicity/:ethnicity/kit/:kit/colour/:colour', async (req, res, next) => {
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

image.get('/skin/:skin/shadow/:shadow/cheek/:cheek/hair_top/:hair_top/hair_bottom/:hair_bottom/beard/:beard/tache/:tache/kit/:kit/colour/:colour/', async (req, res, next) => {
    try {

        const paramTokenValues = {
            skin: req.params.skin,
            shadow: req.params.shadow,
            cheek: req.params.cheek,
            hair_top: req.params.hair_top,
            hair_bottom: req.params.hair_bottom,
            beard: req.params.beard,
            tache: req.params.tache,
            kit: req.params.kit,
            colour: req.params.colour,
        };

        const svg = cheerioSVGService.player(require('./svgString'), paramTokenValues);
        res.contentType('image/svg+xml');
        return res.send(svg);
    } catch (e) {
        next(e);
    }
});

module.exports = image;
