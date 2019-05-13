const _ = require('lodash');

const admin = require('firebase-admin');

let db;
let firestore;

module.exports = {
    database: () => {
        if (db) {
            // console.log("using cached DB instance");
            return db;
        }
        if (!admin) {
            throw new Error('Service not setup...!');
        }
        db = admin.database();
        return db;
    },
    firestore: (overAdmin = false) => {
        if (firestore) {
            // console.log("using cached firestore instance");
            return firestore;
        }
        if (!overAdmin && !admin) {
            throw new Error('Service not setup...!');
        }

        // When invoking from a script (see ./scripts/) we need to bootstrap firebase earlier
        firestore = overAdmin
            ? overAdmin.firestore()
            : admin.firestore();

        const settings = {timestampsInSnapshots: true};
        firestore.settings(settings);
        return firestore;
    }
};
