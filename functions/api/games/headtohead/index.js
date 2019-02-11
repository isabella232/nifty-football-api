const _ = require('lodash');

const headToHead = require('express').Router();

headToHead.get('list/open', async (req, res, next) => {
    try {

    } catch (e) {
        next(e);
    }
});

module.exports = headToHead;
