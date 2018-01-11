const Twit = require('twit');

function basicCallback(err, data) {
  if (err) {
    console.log('Error:'. err);
    return null;
  }
  return data;
}

class Bot {
  constructor(botconfig) {
    this.twit = new Twit(botconfig);
    console.log('Bot initialized....');
  }

  tweet(status) {
    if (typeof status !== 'string') {
      return callback(new Error('tweet must be of type String'));
    } else if(status.length > 280) {
      return callback(new Error('tweet is too long: ' + status.length));
    }
    this.twit.post('statuses/update', { status: status }, basicCallback);
  };

  manualRetweet(status, rt_slug) {
    if (typeof status !== 'string') {
      return callback(new Error('tweet must be of type String'));
    } else if (status.length > 280) {
      return callback(new Error('tweet is too long: ' + status.length));
    }
    let new_status;
    const overage = status.length-(280-rt_slug.length);
    if (overage > 0) {
      const trim_position = status.length - overage - 3;
      new_status = `${status.slice(0, trim_position)}...`;
    } else {
      new_status = status;
    }
    return this.tweet(`${rt_slug}${new_status}`);
  }

  streamTweetersTweets(ids, callback) {
    const stream = this.twit.stream('statuses/filter', { follow: ids, tweet_mode: 'extended' });
    stream.on('tweet', (tweet) => callback(tweet));
  }

  extractTweetText(tweet) {
    return tweet.truncated === true ? tweet.extended_tweet.full_text : tweet.text;
  }
}

module.exports = Bot;