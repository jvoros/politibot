interface Library {
  [key: string]: TopicDef;
}

interface TopicDef {
  keywords?: string[];
  meta?: string[];
  responses?: string[];
}

interface TweetBits {
  status: string;
  meta: string[];
  user: string;
}