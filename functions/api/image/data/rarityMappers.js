const _ = require('lodash');

const nations = require('./nations');
const positions = require('./positions').LOOKUP;
const kits = require(`./kits`);
const colours = require(`./colours`);

const ethnicityMapper = (rawData) => {
    const data = _.map(rawData, _.toNumber);
    const groupedData = _.groupBy(data);
    const total = data.length;

    return _.mapValues(groupedData, (value) => {
        return percentage(total, value.length);
    });
};

const coloursMapper = (rawData) => {

    const data = _.map(rawData, _.toNumber);
    const groupedData = _.groupBy(data);
    const total = data.length;

    return _.chain(groupedData)
        .mapValues((value, key) => {
            return {
                percentage: percentage(total, value.length),
                ...colours[key]
            };
        })
        .mapKeys((value, key) => {
            return colours[key].name;
        })
        .value();
};

const kitsMapper = (rawData) => {

    const data = _.map(rawData, _.toNumber);
    const groupedData = _.groupBy(data);
    const total = data.length;

    return _.chain(groupedData)
        .mapValues((value) => {
            return percentage(total, value.length);
        })
        .mapKeys((value, key) => {
            return kits[key].name;
        })
        .value();
};

const positionsMapper = (rawData) => {

    const data = _.map(rawData, _.toNumber);
    const groupedData = _.groupBy(data);
    const total = data.length;

    return _.chain(groupedData)
        .mapValues((value) => {
            return percentage(total, value.length);
        })
        .mapKeys((value, key) => {
            return _.toLower(positions[key]);
        })
        .value();
};

const nationalitiesMapper = (rawData) => {

    const data = _.map(rawData, _.toNumber);
    const groupedData = _.groupBy(data);
    const total = data.length;

    return _.chain(groupedData)
        .mapValues((value) => {
            return percentage(total, value.length);
        })
        .mapKeys((value, key) => {
            return _.toLower(nations[key].name);
        })
        .value();
};

const percentage = (total, found) => {
    return `${((found / total) * 100).toFixed(2)}%`;
};

module.exports = {
    ethnicityMapper,
    coloursMapper,
    kitsMapper,
    positionsMapper,
    nationalitiesMapper,
};
