const _ = require('lodash');
const cheerio = require('cheerio');

const countriesCodes = ['BE', 'CI', 'EG', 'CO', 'IM', 'NP', 'US', 'UY', 'AD', 'FR', 'BR'];
const firstNames = require('./data/firstNames');
const lastNames = require('./data/lastNames');


class CheerioSVGService {

    process (svgXml, fills = {}, opacityClasses = {}) {
        const $ = cheerio.load(
            svgXml,
            {xmlMode: true}
        );

        _.forEach(fills, (v, k) => $(`#${k}`).attr('fill', v));

        return $.xml();
    }

    buildCard (svgXml, fills = {}, opacityClasses = {}) {
        const $ = cheerio.load(`<div id="card" style="max-width: 350px;margin: auto; "></div>`);

        const countryCode = countriesCodes[Math.floor(Math.random() * countriesCodes.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        $('#card').append(`<h1>${firstName} ${lastName}</h1>`);
        $('#card').append(`<img src="https://www.countryflags.io/${countryCode}/flat/64.png" style="float: right;">`);
        $('#card').append(`<h2 style="float: left;">${Math.floor(Math.random() * 70) + 30}</h2>`);
        $('#card').append(svgXml);

        return $.html();
    }
}

module.exports = new CheerioSVGService();
