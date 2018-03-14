interface TopicDef {
  keywords: string[],
  responses: string[]
}

interface Library { 
  [key: string]: TopicDef
}

interface TweetBits {
  status: string;
  meta: string[];
  user: string;
}
