const STANDARD = 'Standard';
const NONE = 'None';

const specialMapper = (special) => {
    if (special === 0) {
        return NONE;
    }
    console.error(`Invalid special found [${special}]`);
    return NONE;
};

const badgeMapper = (badge) => {
    if (badge === 0) {
        return NONE;
    }
    console.error(`Invalid sponsor found [${badge}]`);
    return NONE;
};

const sponsorMapper = (sponsor) => {
    if (sponsor === 0) {
        return NONE;
    }
    console.error(`Invalid sponsor found [${sponsor}]`);
    return NONE;
};

const bootsMapper = (boots) => {
    switch (boots) {
        case 0:
            return {name: STANDARD, hex: '#000000'};
        case 1:
            return {name: 'Neon Yellow', hex: '#FFFF00'};
        case 2:
            return {name: 'Neon Purple', hex: '#5600FF'};
        case 3:
            return {name: 'Blizzard Blue', hex: '#50BFE6'};
        case 4:
            return {name: 'Shocking Pink', hex: '#FF6EFF'};
        case 5:
            return {name: 'Gold', hex: '#DAA520'};
        default:
            console.error(`Invalid boots found [${boots}]`);
            return {name: STANDARD, hex: '#000000'};
    }
};

const numberMapper = (number) => {
    if (number === 0) {
        return NONE;
    }
    console.error(`Invalid number found [${number}]`);
    return NONE;
};

const averageAttributeMapper = ({strength = 0, speed = 0, intelligence = 0, skill = 0}) => {
    try {
        return Math.floor((strength + speed + intelligence + skill) / 4);
    }
    catch (e) {
        console.error(`Unable to average attributes ${strength}, ${speed}, ${intelligence}, ${skill}`, e)
    }
};

const backgroundColourMapper = (number) => {
    switch (number) {
        // 44 ENGLAND
        // 1 USA
        // 39 ITALY
        // 54 ARGENTINA
        // 55 BRAZIL
        // 7 RUSSIA

        // NOTE without # on hex for OpenSea
        case 44:
            return {hex: 'F8F8FF', name: 'ghostwhite'};
        case 1:
            return {hex: 'F8F8FF', name: 'ghostwhite'};
        case 39:
            return {hex: 'C4D7F3', name: 'dullblue'};
        case 54:
            return {hex: 'ACCAFF', name: 'blueblue'};
        case 55:
            return {hex: 'FFEEBF', name: 'yellow'};
        case 7:
            return {hex: 'F8F8FF', name: 'ghostwhite'};
        default:
            console.error(`Invalid backgroundColourMapper found [${number}]`);
            return {hex: 'C4D7F3', name: 'dullblue'};
    }
};

module.exports = {
    specialMapper,
    badgeMapper,
    sponsorMapper,
    bootsMapper,
    numberMapper,
    backgroundColourMapper,
    bootsMapper,
    averageAttributeMapper,
};
