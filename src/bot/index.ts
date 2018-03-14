import * as Twit from 'twit';
import * as IBot from './_types';
import { IncomingMessage } from 'http';
import * as fs from 'fs';

export default class {
  
  name: string;
  twit: IBot.Twit;
  stream: IBot.Stream;

  constructor(name: string, botconfig: IBot.Options) {
    this.name = name;
    this.twit = new Twit(botconfig);
    console.log('STARTING UP:', this.name);
  }

  // HELPERS

  extractTweetBits(tweet: IBot.Twitter.Status): TweetBits {
    const status = (tweet.truncated === true) ? tweet.extended_tweet.full_text : tweet.text;
    const mentions = tweet.entities.user_mentions.map((mention) => mention.screen_name.toLowerCase());
    const hashtags = tweet.entities.hashtags.map((tag) => tag.text.toLowerCase());
    const meta = mentions.concat(hashtags);
    const user = tweet.user.screen_name;
    return { status, meta, user };
  }
  
  tweetCallback(err: Error, data: IBot.Response) {
    if (err) {
      console.log(`--- ERROR (${this.name})`, err);
      return null;
    }
    console.log(`+++ Status updated (${this.name})`);
    return data;
  }

  getUsersIdsString(users: string[], callback: IBot.GetUsersIdsStringCallback) {
    const users_array = Array.isArray(users) ? users : [users];
    this.twit.get('users/lookup', { screen_name: users_array.join() }, 
      (err: any, result: any, response: any) => {
        if (err) {
          console.log(`--- ERROR (${this.name})`, err);
          callback(err, null);
        }
        callback(err, result.map(u => u.id_str).join());
      });
  }

  // THE BUSINESS

  startStream(endpoint: IBot.StreamEndpoint, params: IBot.Params, callback: IBot.StreamCallback) {
    this.stream = this.twit.stream(endpoint, params);
    this.stream.on('tweet', (tweet) => {
      console.log(`>>> Tweet received (${this.name}): ${tweet.created_at} by @${tweet.user.screen_name}`);
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

  // Tweeting Funx

  tweet(status: string): void {
    if(status.length > 280) {
      console.log(`--- ERROR (${this.name}) Tweet is too long`);
      return;
    }
    this.twit.post('statuses/update', { status: status }, this.tweetCallback.bind(this));
  };

  oldSchoolRetweet(tweet: IBot.Twitter.Status): void {
    const { status, user } = this.extractTweetBits(tweet);
    const rt_slug = `RT @${user}: `
    const overage = status.length-(280-rt_slug.length);
    let new_status;
    if (overage > 0) {
      const trim_position = status.length - overage - 3;
      new_status = `${status.slice(0, trim_position)}...`;
    } else {
      new_status = status;
    }
    console.log(`::: Retweeting (${this.name}): ${new_status}`);
    this.tweet(`${rt_slug}${new_status}`);
  }

  reply(tweet: IBot.Twitter.Status, status: string): void {
    const params = {
      in_reply_to_status_id: tweet.id_str,
      status: `@${tweet.user.screen_name} ${status}`
    }
    this.twit.post('statuses/update', params, this.tweetCallback.bind(this));
  }

  // React to Users Funx

  streamTweetersTweets(screen_names: string[], callback: IBot.StreamCallback) {
    const follow_ids = this.getUsersIdsString(screen_names, (err, ids) => {
      if (err) return;
      const stream = this.startStream('statuses/filter', { follow: ids, tweet_mode: 'extended' }, (tweet) => {
        // only send tweets by user, not replies or RT by other users
        if (ids.split(',').includes(tweet.user.id_str)) callback(tweet);
      });
    });
  }

  getSomeTweetersTweets(screen_name: string, options: IBot.Params, callback: IBot.Callback) {
    const params = { screen_name, tweet_mode: 'extended', ...options };
    this.twit.get('statuses/user_timeline', params, (err, data, response) => {
      console.log(`::: Received tweets from @${screen_name}`);
      callback(err, data, response);
    })
  }

  streamMentions(screen_name: string, callback: IBot.StreamCallback) {
    const params = { track: `@${screen_name}`, tweet_mode: 'extended' };
    const stream = this.startStream('statuses/filter', params, (tweet) => {
      if(
        tweet.in_reply_to_status_id != null ||
        tweet.hasOwnProperty('retweeted_status') ||
        tweet.hasOwnProperty('quoted_status_id')
      ) {
        console.log('xxx Reply, retweet or quote.');
      } else {
        // needs to be better, error check etc...
        this.twit.post('friendships/create', { screen_name: tweet.user.screen_name }, (err, data, response) => {
          console.log('::: Followed @', tweet.user.screen_name);
        });
        callback(tweet);
      }
    });
  }

}
