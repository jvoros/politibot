import * as KeywordExtractor from 'keyword-extractor';

export default class {
  
  topics: { [key: string]: TopicDef };
  ps: string;

  constructor(library: Library, ps: string) {
    this.topics = library;
    this.ps = ps;
    console.log('INTIALIZED Brain...');
  }

  getKeywords(tweet: TweetBits): string[] {
    const params = {
      language:"english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false
    };
    return KeywordExtractor.extract(tweet.status.toLowerCase(), params);
  }

  overlapScore(a: string[], b: string[]): number {
    return a.filter(x => b.indexOf(x) > -1).length;
  }

  topicMatch(a: string[]): { score: number, key: string | null } {
    let match = { score: 0, key: null }
    Object.keys(this.topics).forEach((key) => {
      const score = this.overlapScore(a, this.topics[key].keywords);
      if (score > match.score) {
        match = { score, key }
      }
      if (score > 0 && score === match.score) {
        match = { score, key: [key, match.key][Math.floor(Math.random()*2)]}
      }
    });
    return match;
  }

  getRandomResponse(topic: TopicDef) {
    const r = topic.responses[Math.floor(Math.random()*topic.responses.length)];
    return r.concat(` ${this.ps}`);
  }

  respond(tweet: TweetBits) {
    const prompt = this.getKeywords(tweet);
    const match = this.topicMatch(prompt);
    
    console.log('xxx TweetBits: ', tweet);
    console.log('+++ Prompt words: ', prompt.join(' '));
    console.log('+++ Match: ', match.score, match.key);
   
    return { 
     score: match.score,
     topic: match.key,
     prompt_keywords: prompt,
     response: (match.score === 0) ? this.getRandomResponse(this.topics.def) : this.getRandomResponse(this.topics[match.key])
    };
  }

}
