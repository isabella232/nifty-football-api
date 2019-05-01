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


module.exports = {
    specialMapper,
    badgeMapper,
    sponsorMapper,
    bootsMapper,
    numberMapper,
};
