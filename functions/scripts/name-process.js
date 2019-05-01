const _ = require('lodash');

void async function () {
    const data = require('./data/39_lastname');

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
