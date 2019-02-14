const _ = require('lodash');
const cheerio = require('cheerio');

class CheerioSVGService {

    process (svgXml, fills = {}, opacityClasses = {}) {
        const $ = cheerio.load(
            svgXml,
            {xmlMode: true}
        );

        _.forEach(fills, (v, k) => $(`#${k}`).attr('fill', v));

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
