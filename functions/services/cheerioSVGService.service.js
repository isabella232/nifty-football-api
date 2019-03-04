const _ = require('lodash');
const cheerio = require('cheerio');

const generateSVG = ({nationality, ethnicity, kit, colour}) => {

    const {skin, hair, beard} = require(`./data/${nationality}/ethnicities`)[ethnicity];
    const kitToken = require(`./data/kits`)[kit];
    const {primary, secondary, tertiary} = require(`./data/colours`)[colour];

    console.log(kit, kitToken);

    const fills = {
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

    const opacity = {
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
            fills.verticalStripes = secondary;
            break;
        case 'mixed':
            fills.collar = tertiary;
            fills.verticalStripes = secondary;
            fills.socks = tertiary;
            break;
        case 'tri':
            fills.collar = tertiary;
            fills.shorts = secondary;
            fills.socks = tertiary;
            break;
        case 'one-tone':
            fills.collar = primary;
            fills.collar = primary;
            fills.shorts = primary;
            fills.socks = primary;
            fills.shirtTrim = primary;
            fills.shortsTrimMiddle = primary;
            fills.sockTrim = primary;
            fills.sockTopTrim = primary;
            break;
        case 'one-hoop':
            opacity.centerHoop = 1;
            break;
        case 'tri-hoop':
            opacity.topHoop = 1;
            opacity.centerHoop = 1;
            opacity.bottomHoop = 1;
            break;
        case 'all-trim':
            fills.shirtTrim = secondary;
            fills.shortsTrimMiddle = primary;
            fills.sockTrim = primary;
            fills.sockTopTrim = primary;
            break;
        case 'classic-sock-band':
            fills.collar = primary;
            fills.shirtTrim = primary;
            fills.shortsTrimMiddle = secondary;
            fills.sockTrim = primary;
            fills.sockTopTrim = secondary;
            break;
        case 'top-hoop':
            opacity.topHoop = 1;
            opacity.centerHoop = 0;
            opacity.bottomHoop = 0;
            break;
        default:
    }

    return {
        fills,
        opacity
    };
};

class CheerioSVGService {

    process (svgXml, {nationality, ethnicity, kit, colour}) {
        const {fills, opacity} = generateSVG({nationality, ethnicity, kit, colour});

        const $ = cheerio.load(
            svgXml,
            {xmlMode: true}
        );

        _.forEach(fills, (v, k) => $(`#${k}`).attr('fill', v));
        _.forEach(opacity, (v, k) => $(`#${k}`).attr('opacity', v));

        // FIXME - once we have new SVG or clearance for side head.
        $('#skin').attr('opacity', 0);
        $('#neckShadow').attr('opacity', 0);
        $('#hair').attr('opacity', 0);
        $('#eye').attr('opacity', 0);
        $('#beard').attr('opacity', 0);

        return $.xml();
    }

    buildCard (svgXml, {nationalityText, firstNameText, lastNameText, attributeAverage}) {
        const $ = cheerio.load(`<div id="card" style="max-width: 350px;margin: auto; "></div>`);

        $('#card').append(`<h1>${firstNameText} ${lastNameText}</h1>`);
        $('#card').append(`<h2 style="float: right;">${nationalityText}</h2>`);
        $('#card').append(`<h2 style="float: left;">${attributeAverage}</h2>`);
        $('#card').append(svgXml);

        return $.html();
    }
}

module.exports = new CheerioSVGService();
