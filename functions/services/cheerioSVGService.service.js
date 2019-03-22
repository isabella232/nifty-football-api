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

const generateSVG = ({skin, shadow, cheek, eye, hair_top, hair_bottom, beard, tache, stubble, kitToken, primary, secondary, tertiary}) => {

    let fills = {
        Background: '#247209',
        // Background: shadeColor(primary, -50),
        Body: skin[0],
        Cheek: cheek[0],
        Shadow: shadow[0],
        Eye: eye[0],
        Stubble: stubble[0],

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
        Croat_LS: secondary,
        Croat_SS: secondary,
    };

    let opacity = {
        Body: skin[1],
        Cheek: 1,
        Shadow: 1,
        Eye: eye[1],
        Stubble: stubble[1],

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
        Croat_LS: 0,
        Croat_SS: 0,
        Lyon_lower_strip: 0,
        Lyon_top_Layer: 0,
    };

    // console.log(kitToken);
    switch (kitToken) {
        case 'classic':
            opacity = {
                ...opacity,
                Stripe: 1,
            };
            fills = {
                ...fills,
                Stripe: primary === white ? whiteDark : shadeColor(primary, -4),
            };
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
                Stripe: 1,
            };
            fills = {
                ...fills,
                Stripe: primary === white ? whiteDark : shadeColor(primary, -4),
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
                Stripe: primary === white ? whiteDark : shadeColor(primary, -4),
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
                Stripe: primary === white ? whiteDark : shadeColor(primary, -4),
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
                Stripe: primary === white ? whiteDark : shadeColor(primary, -4),
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
                Stripe: primary === white ? '#F5F5F5' : shadeColor(primary, -4),
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
        case 'chequed':
            opacity = {
                ...opacity,
                Croat_LS: 1,
                Neckline: 1,
                Cuff: 1,
            };
            fills = {
                ...fills,
                Cuff: secondary,
                Sock_Stripes: primary,
                Socks: primary,
            };
            break;
        case 'chequed-short':
            opacity = {
                ...opacity,
                Croat_SS: 1,
                Neckline: 1,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
            };
            fills = {
                ...fills,
                ShortSleeve_cuff: secondary,
                Sock_Stripes: primary,
                Socks: primary,
            };
            break;
        case 'arse':
            fills = {
                ...fills,
                LongSleeve: secondary,
                Long_Sleeve: primary,
                Cuff: primary,
            };
            break;
        case 'arse-short':
            opacity = {
                ...opacity,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
            };
            fills = {
                ...fills,
                ShortSleeve: secondary,
                Short_Sleeve: primary,
                ShortSleeve_cuff: primary,
            };
            break;
        case 'classic-tertiary-shorts':
            fills = {
                ...fills,
                Shorts: tertiary,
            };
            break;
        case 'classic-tertiary-shorts-short':
            opacity = {
                ...opacity,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
            };
            fills = {
                ...fills,
                Shorts: tertiary,
            };
            break;
        case 'classic-tertiary-socks':
            fills = {
                ...fills,
                Socks: tertiary,
                Sock_Stripes: tertiary,
                Upper_Sock: tertiary,
            };
            break;
        case 'classic-tertiary-socks-short':
            opacity = {
                ...opacity,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
            };
            fills = {
                ...fills,
                Socks: tertiary,
                Sock_Stripes: tertiary,
                Upper_Sock: tertiary,
            };
            break;
        case 'lyon':
            opacity = {
                ...opacity,
                Lyon_lower_strip: 1,
                Lyon_top_Layer: 1,
                Neckline: 0,
            };
            fills = {
                ...fills,
                Lyon_lower_strip: tertiary,
                Lyon_top_Layer: secondary,
            };
            break;
        case 'lyon-short':
            opacity = {
                ...opacity,
                Long_Sleeve: 0,
                LongSleeve: 0,
                Cuff: 0,
                Short_Sleeve: 1,
                ShortSleeve: 1,
                ShortSleeve_cuff: 1,
                Lyon_lower_strip: 1,
                Lyon_top_Layer: 1,
                Neckline: 0,
            };
            fills = {
                ...fills,
                Lyon_lower_strip: tertiary,
                Lyon_top_Layer: secondary,
            };
            break;
        default:
    }

    return {
        fills,
        opacity
    };
};

const fillSVG = ($, {fills, opacity, name, position, average, tokenId}) => {

    _.forEach(fills, (v, k) => $(`#${k}`).attr('fill', v));
    _.forEach(opacity, (v, k) => $(`#${k}`).attr('opacity', v));

    _.forEach(fills, (v, k) => $(`.st11`).attr('fill', fills.Shadow));
    _.forEach(fills, (v, k) => $(`.st12`).attr('fill', fills.Cheek));

    $('#Name').html(name ? name.toUpperCase() : 'NA');
    $('#Position').html(position ? position.toUpperCase() : 'NA');
    $('#Average').html(average ? average : 'NA');
    $('#TokenId').html('#' + ('0000000' + parseInt(tokenId)).slice(-8));
};

class CheerioSVGService {

    process (svgXml, {ethnicity, kit, colour, fullName, positionText, attributeAvg, tokenId}) {
        const ethnicities = require(`./data/ethnicities`)[ethnicity];
        const kitToken = require(`./data/kits`)[kit];
        const colours = require(`./data/colours`)[colour];

        const {fills, opacity} = generateSVG({...ethnicities, kitToken, ...colours});

        const $ = cheerio.load(
            svgXml,
            {xmlMode: true}
        );

        fillSVG($, {fills, opacity, name: fullName, position: positionText, average: attributeAvg, tokenId});

        return $.xml();
    }

    player (svgXml, {skin, shadow, cheek, eye, hair_top, hair_bottom, beard, tache, stubble, kit, colour, name = 'Andy Gray', position = 'Striker', average = '91', tokenId = 123}) {

        const kitToken = require(`./data/kits`)[kit];
        const colours = require(`./data/colours`)[colour];

        const {fills, opacity} = generateSVG({
            skin,
            shadow,
            cheek,
            eye,
            hair_top,
            hair_bottom,
            beard,
            tache,
            stubble,
            kitToken,
            ...colours
        });

        const $ = cheerio.load(
            svgXml,
            {xmlMode: true}
        );

        fillSVG($, {fills, opacity, name, position, average, tokenId});

        return $.xml();
    }
}

module.exports = new CheerioSVGService();
