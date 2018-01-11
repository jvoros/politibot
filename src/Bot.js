const Twit = require('twit');

class Bot {
  constructor(name, botconfig) {
    this.name = name;
    this.twit = new Twit(botconfig);
    console.log('STARTING UP:', this.name);
  }

  tweetCallback(err, data) {
    if (err) {
      console.log(`--- ERROR (${this.name})`, err);
      return null;
    }
    console.log(`+++ Status updated (${this.name})`);
    return data;
  }

  tweet(status) {
    if (typeof status !== 'string') {
      return callback(new Error('tweet must be of type String'));
    } else if(status.length > 280) {
      return callback(new Error('tweet is too long: ' + status.length));
    }
    this.twit.post('statuses/update', { status: status }, this.tweetCallback.bind(this));
  };

  manualRetweet(tweet) {
    const rt_slug = `RT @${tweet.user.screen_name}: `
    const status = this.extractStatus(tweet);
    const overage = status.length-(280-rt_slug.length);
    let new_status;
    if (overage > 0) {
      const trim_position = status.length - overage - 3;
      new_status = `${status.slice(0, trim_position)}...`;
    } else {
      new_status = status;
    }
    console.log(`::: Retweeting (${this.name}): ${new_status}`);
    return this.tweet(`${rt_slug}${new_status}`);
  }

  streamTweetersTweets(ids, callback) {
    const stream = this.twit.stream('statuses/filter', { follow: ids, tweet_mode: 'extended' });
    stream.on('tweet', (tweet) => {
      console.log(`>>> Tweet received (${this.name}): ${tweet.created_at}`);
      callback(tweet)
    });
  }

  extractStatus(tweet) {
    return tweet.truncated === true ? tweet.extended_tweet.full_text : tweet.text;
  }
}

module.exports = Bot;