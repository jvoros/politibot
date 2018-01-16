"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var e = process.env;
exports.default = {
    scubblesbot: {
        id: e.ID,
        consumer_key: e.CONSUMER_KEY,
        consumer_secret: e.CONSUMER_SECRET,
        access_token: e.ACCESS_TOKEN,
        access_token_secret: e.ACCESS_TOKEN_SECRET,
    },
    utahroger: {
        id: e.UR_ID,
        consumer_key: e.UR_CONSUMER_KEY,
        consumer_secret: e.UR_CONSUMER_SECRET,
        access_token: e.UR_ACCESS_TOKEN,
        access_token_secret: e.UR_ACCESS_TOKEN_SECRET,
    },
    rogerrogerbot: {
        id: e.RR_ID,
    },
    miaworks4utah: {
        id: e.ML_ID,
        consumer_key: e.ML_CONSUMER_KEY,
        consumer_secret: e.ML_CONSUMER_SECRET,
        access_token: e.ML_ACCESS_TOKEN,
        access_token_secret: e.ML_ACCESS_TOKEN_SECRET,
    },
    textrazor: {
        api_key: e.TEXTRAZOR_API_KEY,
    },
    twoheadlines: {
        id: 1705052335,
    },
    googlefacts: {
        id: 559675462,
    }
};
//# sourceMappingURL=config.js.map