const ethnicityService = require('../services/ethnicity.service');
const kitService = require('../services/kit.service');
const cheerioSVGService = require('../services/cheerioSVGService.service');

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

module.exports = {

    async fillSVG (request, response) {
        try {
            const svg = generateSVG();
            console.log(svg);
            response.contentType('image/svg+xml');
            return response.send(svg);
        } catch (e) {
            console.error(e);
        }
    },

    async cardMockup (request, response) {
        try {
            const svg = generateSVG();

            response.contentType('text/html');
            return response.send(cheerioSVGService.buildCard(svg));
        } catch (e) {
            console.error(e);
        }
    }
};
