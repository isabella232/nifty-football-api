const _ = require('lodash');

void async function () {
    const data = require('./data/7_lastname');

    console.log(
        _.reduce(data, (obj, v, i) => {
                return {
                    ...obj,
                    [i]: {
                        latin: v
                    }
                };
            }, {}
        )
    );
}();
