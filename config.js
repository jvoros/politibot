require('dotenv').config();

const e = process.env;

module.exports = {
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
};