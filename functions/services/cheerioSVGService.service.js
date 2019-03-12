const _ = require('lodash');
const cheerio = require('cheerio');

const shadeColor = (color, percent) => {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length == 1) ? '0' + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? '0' + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? '0' + B.toString(16) : B.toString(16));

    return `#${RR}${GG}${BB}`.toUpperCase();
};

const black = `#000`;
const white = `#FFF`;
const whiteDark = '#F5F5F5';

const generateSVG = ({nationality, ethnicity, kit, colour}) => {

    const {skin, shadow, cheek, hair_top, hair_bottom, beard, tache} = require(`./data/${nationality}/ethnicities`)[ethnicity];
    const kitToken = require(`./data/kits`)[kit];
    const {primary, secondary, tertiary} = require(`./data/colours`)[colour];

    let fills = {
        Background: '#247209',
        Body: skin[0],
        Cheek: cheek[0],
        Shadow: shadow[0],
        Eye: black,

        Hair_Bottom_Layer: hair_bottom[0],
        Hair_Top_Layer: hair_top[0],

        Beard: beard[0],
        Moustache: tache[0],

        Long_Sleeve: primary,
        LongSleeve: primary,
        Cuff: secondary,

        Short_Sleeve: primary,
        ShortSleeve: primary,
        ShortSleeve_cuff: secondary,

        Pectoral_Shadow: black,

        Shorts: secondary,
        Short_trim: secondary,

        Upper_Sock: primary,
        Sock_Stripes: secondary,
        Socks: secondary,

        Neckline: secondary,

        Stripe: secondary,
        Boca_Stripe: secondary,
        Rovers_Shirt_Panel_Long_Sleeve: secondary,
        Rovers_Shirt_Panel_Short_Sleeve: secondary,
        Pinstripe: secondary,
        Villa_style_LS: secondary,
        Sash: secondary,
        Chevron: secondary,
        Hoops_Long_Sleeve: secondary,
        Fade: secondary,
    };

    let opacity = {
        Body: skin[1],
        Cheek: 1,
        Shadow: 1,
        Eye: 0.8,

        Hair_Top_Layer: hair_top[1],
        Hair_Bottom_Layer: hair_bottom[1],

        Beard: beard[1],
        Moustache: tache[1],
        Neckline: 1,

        Pectoral_Shadow: 0.075,

        Long_Sleeve: 1,
        LongSleeve: 1,
        Cuff: 1,

        Short_Sleeve: 0,
        ShortSleeve: 0,
        ShortSleeve_cuff: 0,

        Shorts: 1,
        Short_trim: 0,

        Upper_Sock: 1,
        Sock_Stripes: 1,
        Socks: 1,

        Stripe: 0,
        Boca_Stripe: 0,
        Rovers_Shirt_Panel_Long_Sleeve: 0,
        Rovers_Shirt_Panel_Short_Sleeve: 0,
        Pinstripe: 0,
        Villa_style_LS: 0,
        Sash: 0,
        Chevron: 0,
        Hoops_Long_Sleeve: 0,
    };

    console.log(kitToken);
    switch (kitToken) {
        case 'classic':
            break;
        case 'classic-short':
            opacity = {
                ...opacity,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
            };
            break;
        case 'classic-stripe':
            opacity = {
                ...opacity,
                Stripe: 1,
            };
            break;
        case 'classic-single-hoop':
            opacity = {
                ...opacity,
                Boca_Stripe: 1,
                Neckline: 0,
                Cuff: 0,
            };
            break;
        case 'classic-rovers':
            opacity = {
                ...opacity,
                Rovers_Shirt_Panel_Long_Sleeve: 1,
            };
            break;
        case 'classic-pinstripe':
            opacity = {
                ...opacity,
                Pinstripe: 1,
            };
            break;
        case 'classic-villa':
            opacity = {
                ...opacity,
                Villa_style_LS: 1,
                Neckline: 0,
                Cuff: 0,
            };
            break;
        case 'classic-sash':
            opacity = {
                ...opacity,
                Sash: 1,
                Neckline: 0,
                Cuff: 0,
            };
            break;
        case 'classic-chevron':
            opacity = {
                ...opacity,
                Chevron: 1,
            };
            break;
        case 'classic-hoops':
            opacity = {
                ...opacity,
                Hoops_Long_Sleeve: 1,
            };
            break;
        case 'classic-stripe-short':
            opacity = {
                ...opacity,
                Stripe: 1,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
            };
            break;
        case 'classic-single-hoop-short':
            opacity = {
                ...opacity,
                Boca_Stripe: 1,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Neckline: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 0,
            };
            break;
        case 'classic-rovers-short':
            opacity = {
                ...opacity,
                Rovers_Shirt_Panel_Short_Sleeve: 1,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
            };
            break;
        case 'classic-pinstripe-short':
            opacity = {
                ...opacity,
                Pinstripe: 1,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
            };
            break;
        case 'classic-villa-short':
            opacity = {
                ...opacity,
                Villa_style_LS: 1,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Neckline: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 0,
            };
            break;
        case 'classic-sash-short':
            opacity = {
                ...opacity,
                Sash: 1,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Neckline: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 0,
            };
            break;
        case 'classic-chevron-short':
            opacity = {
                ...opacity,
                Chevron: 1,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
            };
            break;
        case 'classic-hoops-short':
            opacity = {
                ...opacity,
                Hoops_Long_Sleeve: 1,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
            };
            break;
        case 'one-tone-no-trim':
            opacity = {
                ...opacity,
                Stripe: 1,
                Neckline: 0,
            };
            fills = {
                ...fills,
                Cuff: primary,
                Shorts: primary,
                Sock_Stripes: primary,
                Socks: primary,
                Stripe: primary === white ? whiteDark : shadeColor(primary, -8),
            };
            break;
        case 'one-tone-no-trim-short':
            opacity = {
                ...opacity,
                Stripe: 1,
                Neckline: 0,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
            };
            fills = {
                ...fills,
                ShortSleeve_cuff: primary,
                Shorts: primary,
                Sock_Stripes: primary,
                Socks: primary,
                Stripe: primary === white ? whiteDark : shadeColor(primary, -8),
            };
            break;
        case 'one-tone-trim':
            opacity = {
                ...opacity,
                Stripe: 1,
                Short_trim: 1,
            };
            fills = {
                ...fills,
                Cuff: secondary,
                Shorts: primary,
                Short_trim: secondary,
                Upper_Sock: secondary,
                Sock_Stripes: primary,
                Socks: primary,
                Stripe: primary === white ? whiteDark : shadeColor(primary, -8),
            };
            break;
        case 'one-tone-trim-short':
            opacity = {
                ...opacity,
                Stripe: 1,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
                Short_trim: 1,
            };
            fills = {
                ...fills,
                ShortSleeve_cuff: secondary,
                Shorts: primary,
                Short_trim: secondary,
                Upper_Sock: secondary,
                Sock_Stripes: primary,
                Socks: primary,
                Stripe: primary === white ? '#F5F5F5' : shadeColor(primary, -8),
            };
            break;
        case 'fade':
            opacity = {
                ...opacity,
                Fade: 1,
                Neckline: 0,
                Cuff: 0,
            };
            fills = {
                ...fills,
                Cuff: secondary,
                Sock_Stripes: secondary,
                Socks: primary,
            };
            break;
        case 'fade-short':
            opacity = {
                ...opacity,
                Fade: 1,
                Neckline: 0,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 0,
            };
            fills = {
                ...fills,
                ShortSleeve_cuff: secondary,
                Sock_Stripes: secondary,
                Socks: primary,
            };
            break;

        //     'one-tone-trim',
        //     'one-tone-trim-short',

        // case 'mixed':
        //     fills.collar = tertiary;
        //     fills.verticalStripes = secondary;
        //     fills.socks = tertiary;
        //     break;
        // case 'tri':
        //     fills.collar = tertiary;
        //     fills.shorts = secondary;
        //     fills.socks = tertiary;
        //     break;
        // case 'one-tone':
        //     fills.collar = primary;
        //     fills.collar = primary;
        //     fills.shorts = primary;
        //     fills.socks = primary;
        //     fills.shirtTrim = primary;
        //     fills.shortsTrimMiddle = primary;
        //     fills.sockTrim = primary;
        //     fills.sockTopTrim = primary;
        //     break;
        // case 'one-hoop':
        //     opacity.centerHoop = 1;
        //     break;
        // case 'tri-hoop':
        //     opacity.topHoop = 1;
        //     opacity.centerHoop = 1;
        //     opacity.bottomHoop = 1;
        //     break;
        // case 'all-trim':
        //     fills.shirtTrim = secondary;
        //     fills.shortsTrimMiddle = primary;
        //     fills.sockTrim = primary;
        //     fills.sockTopTrim = primary;
        //     break;
        // case 'classic-sock-band':
        //     fills.collar = primary;
        //     fills.shirtTrim = primary;
        //     fills.shortsTrimMiddle = secondary;
        //     fills.sockTrim = primary;
        //     fills.sockTopTrim = secondary;
        //     break;
        // case 'top-hoop':
        //     opacity.topHoop = 1;
        //     opacity.centerHoop = 0;
        //     opacity.bottomHoop = 0;
        //     break;
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

        _.forEach(fills, (v, k) => $(`.st2`).attr('fill', fills.Shadow));
        _.forEach(fills, (v, k) => $(`.st3`).attr('fill', fills.Cheek));

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
