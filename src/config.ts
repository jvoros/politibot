import 'dotenv/config';
import * as path from 'path';

const e = process.env;

export default {
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
  repmiabot: {
    id: e.ML_ID,
    consumer_key: e.ML_CONSUMER_KEY,
    consumer_secret: e.ML_CONSUMER_SECRET,
    access_token: e.ML_ACCESS_TOKEN,
    access_token_secret: e.ML_ACCESS_TOKEN_SECRET,
  },
  word2vectorModel: {
    path: path.join(__dirname, '../wordvectors/GoogleNews-vectors-negative300-SLIM.bin')
  }
};