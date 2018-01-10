const Twit = require('twit');


export default class Bot {
  constructor(botconfig) {
    this.twit = new Twit(botconfig);
  }

  defaultCallback(error, data) {
    if (error) {
      console.error('ERROR: ', err);
      return error;
    }
    return data;
  }

  tweet(status) {
    if (typeof status !== 'string') {
      return callback(new Error('tweet must be of type String'));
    } else if(status.length > 280) {
      return callback(new Error('tweet is too long: ' + status.length));
    }
    this.twit.post('statuses/update', { status: status }, this.defaultCallback(error, data));
  };

  manualRetweet(status, rt_slug) {
    if (typeof status !== 'string') {
      return callback(new Error('tweet must be of type String'));
    } else if (status.length > 280) {
      return callback(new Error('tweet is too long: ' + status.length));
    }
    const overage = status.length-(280-rt_slug.length);
    const trim_position = status.length - overage;
    const sliced_text = status.slice(0, trim_position);
    return this.tweet(rt_slug.concat('', sliced_text));
  }

  streamTweetersTweets(ids, callback) {
    const stream = this.twit.stream('statuses/filter', { follow: ids, tweet_mode: 'extended' });
    stream.on('tweet', (tweet) => {
      const text = tweet.truncated === true ? tweet.extended_tweet.full_text : tweet.text;
      console.log(`${tweet.created_at}: ${text}`);
      
    });
  }
}