const functions = require('firebase-functions');

const API_KEY = functions.config().secret.api.key;
if (!API_KEY) {
    throw new Error("No Secret API Key found - is the project setup correctly");
}

module.exports = function (request, response, next) {
    // Validate incoming API
    if (request.query.key !== API_KEY) {
        console.error("Missing or invalid API key");
        response.status(500).send("Missing or invalid API key");
    } else {
        next();
    }
};
