import * as Twit from 'twit';

export interface ExtendedTweet extends Twit.Twitter.Status {
  extended_tweet?: {
    full_text: string,
  }
}

export interface StreamParams {
  follow?: string;
  tweet_mode?: string;
  track?: string;
}

export interface GetUsersIdsStringCallback {
  (err: Error, ids: string): void;
}

export interface StreamCallback {
  (tweet: Twit.Twitter.Status): void;
}

export interface Callback {
  (err: Error, result: Response): void
}
