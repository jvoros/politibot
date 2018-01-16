import * as Twit from 'twit';
import { IncomingMessage } from 'http';

interface ExtendedTweet extends Twit.Twitter.Status {
  extended_tweet?: {
    full_text: string,
  }
}

interface GetUsersIdsStringCallback {
  (err: Error, ids: string): void;
}

interface StreamCallback {
  (tweet: Twit.Twitter.Status): void;
}

export default class Bot {
  
  name: string;
  twit: Twit;
  stream: Twit.Stream;

  constructor(name: string, botconfig: Twit.Options) {
    this.name = name;
    this.twit = new Twit(botconfig);
    console.log('STARTING UP:', this.name);
  }

  // HELPERS

  extractStatus(tweet: ExtendedTweet) {
    return tweet.truncated === true ? tweet.extended_tweet.full_text : tweet.text;
  }


  tweetCallback(err: Error, data: Twit.Response) {
    if (err) {
      console.log(`--- ERROR (${this.name})`, err);
      return null;
    }
    console.log(`+++ Status updated (${this.name})`);
    return data;
  }

  // THE BUSINESS

  // Utility funx

  getUsersIdsString(users: Array<string>, callback: GetUsersIdsStringCallback) {
    const users_array = Array.isArray(users) ? users : [users];
    this.twit.get('users/lookup', { screen_name: users_array.join() }, 
      (err: Error, data: Array<Twit.Twitter.User>, response: IncomingMessage) => {
        if (err) {
          console.log(`--- ERROR (${this.name})`, err);
          callback(err, null);
        }
        callback(err, data.map(u => u.id_str).join());
      });
  }

  startStream(endpoint: Twit.StreamEndpoint, params: Twit.Params, callback: StreamCallback) {
    this.stream = this.twit.stream(endpoint, params);
    this.stream.on('tweet', (tweet) => {
      console.log(`>>> Tweet received (${this.name}): ${tweet.created_at} by @${tweet.screen_name}`);
      callback(tweet);
    });
    this.stream.on('connect', () => {
      console.log(`::: Stream connected (${this.name})`);
    });
    
    this.stream.on('reconnect', (request, response, connectInterval) => {
      console.log(`xxx Reconnect Request (${this.name}):`, request);
      console.log(`xxx Reconnect Response (${this.name}):`, response);
      console.log(`xxx Reconnect Interval (${this.name}):`, connectInterval);
    });
    
    this.stream.on('error', (err) => {
      console.log(`--- ERROR (${this.name}) stream: `, err);
    });
  }

  // Tweeting funx

  tweet(status) {
    if (typeof status !== 'string') {
      return callback(new Error('tweet must be of type String'));
    } else if(status.length > 280) {
      return callback(new Error('tweet is too long: ' + status.length));
    }
    this.twit.post('statuses/update', { status: status }, this.tweetCallback.bind(this));
  };

  oldSchoolRetweet(tweet) {
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

  // React to users' funx

  streamTweeterTweets(screen_names, callback) {
    const follow_ids = this.getUsersIdsString(screen_names, (err, ids) => {
      if (err) return;
      const stream = this.startStream('statuses/filter', { follow: ids, tweet_mode: 'extended' }, (tweet) => {
        // only send tweets by user, not replies or RT by other users
        if (ids.split(',').includes(tweet.user.id_str)) callback(tweet);
      });
    });
  }

  getSomeTweetersTweets(screen_name, options, callback) {
    const params = { screen_name, tweet_mode: 'extended', ...options };
    this.twit.get('statuses/user_timeline', params, (err, data, response) => {
      console.log(`::: Received tweets from @${screen_name}`);
      callback(err, data, response);
    })
  }

}
