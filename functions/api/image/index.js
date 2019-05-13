const cheerioSVGService = require('./cheerioSVGService.service');
const niftyFootballContractService = require('../../services/contracts/niftyFootball.contract.service');

const kits = require('./data/kits');
const colours = require('./data/colours');
const nations = require('./data/nations');
const positions = require('./data/positions');
const {fullNameWithLengthCheckMapper} = require('./data/mappers');

const _ = require('lodash');

const image = require('express').Router({mergeParams: true});

// ethnicity: 0,
// kit: 0,
// colour: 0,
// firstName: 0,
// lastName: 0,
// position: 3,
// nation: 44,
image.get('/ethnicity/:ethnicity/kit/:kit/colour/:colour/firstName/:firstName/lastName/:lastName/position/:position/nationality/:nationality', async (req, res, next) => {
    try {
        const nationalityNumber = parseInt(req.params.nationality);
        const paramTokenValues = {
            ethnicity: parseInt(req.params.ethnicity),
            kit: parseInt(req.params.kit),
            colour: parseInt(req.params.colour),
            fullName: fullNameWithLengthCheckMapper({
                firstName: nations[nationalityNumber].firstNames[parseInt(req.params.firstName)].latin,
                lastName: nations[nationalityNumber].lastNames[parseInt(req.params.lastName)].latin,
            }),
            firstName: parseInt(req.params.firstName),
            lastName: parseInt(req.params.lastName),
            nationality: nationalityNumber,
            position: parseInt(req.params.position),
            positionText: positions.LOOKUP[parseInt(req.params.position)],
            attributeAvg: '00',
            tokenId: 0,
            boots: 0,
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
            kits: kits,
            colours: colours,
            nations: nations,
            positions: positions.OPTIONS,
        });
    } catch (e) {
        next(e);
    }
});

image.get('/:tokenId', async (req, res, next) => {
    try {
        const tokenId = req.params.tokenId;
        const network = req.params.network;

        const tokenDetails = await niftyFootballContractService.tokenDetails(network, tokenId);

        const svg = cheerioSVGService.process(require('./svgString'), tokenDetails);

        // console.log(svg);
        res
            .contentType('image/svg+xml')
            .set('Cache-Control', 'public, max-age=86400');
        return res.send(svg);
    } catch (e) {
        next(e);
    }
});

image.get('/:tokenId/back', async (req, res, next) => {
    try {
        const tokenId = req.params.tokenId;
        const network = req.params.network;

        const tokenDetails = await niftyFootballContractService.tokenDetails(network, tokenId);

        const svg = cheerioSVGService.cardBack(tokenDetails);

        // console.log(svg);
        res.contentType('image/svg+xml');
        return res.send(svg);
    } catch (e) {
        next(e);
    }
});

module.exports = image;
