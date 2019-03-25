const cheerioSVGService = require('../../services/cheerioSVGService.service');
const futballcardsService = require('../../services/futballcards.contract.service');

const ethnicities = require('../../services/data/ethnicities');
const kits = require('../../services/data/kits');
const colours = require('../../services/data/colours');

const _ = require('lodash');

const image = require('express').Router({mergeParams: true});

image.get('/skin/:skin/:skin_opacity/shadow/:shadow/cheek/:cheek/eye/:eye/:eye_opacity/hair_top/:hair_top/:hair_top_opacity/hair_bottom/:hair_bottom/:hair_bottom_opacity/beard/:beard/:beard_opacity/tache/:tache/:tache_opacity/stubble/:stubble/:stubble_opacity/kit/:kit/colour/:colour/name/:name/position/:position/average/:average/tokenId/:tokenId', async (req, res, next) => {
    try {

        console.log(req.params);

        const paramTokenValues = {
            skin: [`#${req.params.skin}`, parseFloat(req.params.skin_opacity)],
            shadow: [`#${req.params.shadow}`, 1],
            cheek: [`#${req.params.cheek}`, 1],
            eye: [`#${req.params.eye}`, parseFloat(req.params.eye_opacity)],
            hair_top: [`#${req.params.hair_top}`, parseFloat(req.params.hair_top_opacity)],
            hair_bottom: [`#${req.params.hair_bottom}`, parseFloat(req.params.hair_bottom_opacity)],
            beard: [`#${req.params.beard}`, parseFloat(req.params.beard_opacity)],
            tache: [`#${req.params.tache}`, parseFloat(req.params.tache_opacity)],
            stubble: [`#${req.params.stubble}`, parseFloat(req.params.stubble_opacity)],
            kit: req.params.kit,
            colour: req.params.colour,
            name: req.params.name,
            position: req.params.position,
            average: req.params.average,
            tokenId: parseInt(req.params.tokenId),
        };

        // console.log(paramTokenValues);

        const svg = cheerioSVGService.player(require('../../services/svgString'), paramTokenValues);

        res.contentType('image/svg+xml');
        return res.send(svg);
    } catch (e) {
        next(e);
    }
});

image.get('/xxx', async (req, res, next) => {
    try {

        const paramTokenValues = {
            nationality: 0,
            ethnicity: Math.floor(Math.random() * 11),
            kit: Math.floor(Math.random() * 24),
            colour: Math.floor(Math.random() * 17),
        };

        const svg = cheerioSVGService.process(require('../../services/svgString'), paramTokenValues);
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

        console.log(tokenDetails);

        const svg = cheerioSVGService.process(require('../../services/svgString'), tokenDetails);

        // console.log(svg);
        res.contentType('image/svg+xml');
        return res.send(svg);
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

        const svg = cheerioSVGService.process(require('../../services/svgString'), paramTokenValues);
        res.contentType('image/svg+xml');
        return res.send(svg);
    } catch (e) {
        next(e);
    }
});



module.exports = image;
