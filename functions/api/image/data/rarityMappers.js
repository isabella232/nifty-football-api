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
            return _.capitalize(_.split(colours[key].name, "_").join(" "));
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
            return _.capitalize(_.split(kits[key].name, "_").join(" "));
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
            return _.capitalize(positions[key]);
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
            return _.capitalize(nations[key].name);
        })
        .value();
};

const percentage = (total, found) => {
    return `${((found / total) * 100).toFixed(1)}`;
};

module.exports = {
    ethnicityMapper,
    coloursMapper,
    kitsMapper,
    positionsMapper,
    nationalitiesMapper,
};
