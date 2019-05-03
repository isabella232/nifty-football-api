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
    if (boots === 0) {
        return STANDARD;
    }
    console.error(`Invalid boots found [${boots}]`);
    return STANDARD;
};

const numberMapper = (number) => {
    if (number === 0) {
        return NONE;
    }
    console.error(`Invalid number found [${number}]`);
    return NONE;
};

const backgroundColourMapper = (number) => {
    switch (number) {
        // 44 ENGLAND
        // 1 USA
        // 39 ITALY
        // 54 ARGENTINA
        // 55 BRAZIL
        // 7 RUSSIA
        case 44:
            return {hex: 'F8F8FF', name: 'ghostwhite'};
        case 1:
            return {hex: 'FFCCCC', name: 'red'};
        case 39:
            return {hex: 'C4D7F3', name: 'dullblue'};
        case 54:
            return {hex: 'ACCAFF', name: 'blueblue'};
        case 55:
            return {hex: 'FFEEBF', name: 'yellow'};
        case 7:
            return {hex: 'F8F8FF', name: 'ghostwhite'};
        default:
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
};
