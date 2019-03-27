const _ = require('lodash');

const admin = require('firebase-admin');

module.exports = {
    database: () => {
        return admin.database();
    },
    firestore: () => {
        const firestore = admin.firestore();
        const settings = {timestampsInSnapshots: true};
        firestore.settings(settings);
        return firestore;
    }
};
