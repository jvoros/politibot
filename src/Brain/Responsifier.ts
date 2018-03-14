import * as KeywordExtractor from 'keyword-extractor';

export default class {
  
  prompt: { keywords:string[], meta: string[], user: string, status: string };
  topics: { [key: string]: TopicDef };
  ps: string;

  constructor(library: Library, ps: string) {
    this.topics = library;
    this.ps = ps;
    console.log('INTIALIZED Brain...');
  }

  private setPrompt(tweet: TweetBits): void {
    const { status, meta, user } = tweet;
    const params = {
      language:"english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false
    };
    const keywords = KeywordExtractor.extract(status.toLowerCase(), params);
    this.prompt = { keywords, meta, user, status }
  }

  public overlap(a: string[], b: string[]): string[] {
    return a.filter(x => b.indexOf(x) > -1);
  } 

  private getResponse(topic: TopicDef) {
    const r = topic.responses[Math.floor(Math.random()*topic.responses.length)];
    return r.concat(this.ps);
  }

  public respond(tweet: TweetBits) {
    console.log('xxx TweetBits: ', tweet);
    this.setPrompt(tweet);
    
    let match = {
      score: 0,
      key: null
    }

    // compare topics to prompt
    Object.keys(this.topics).forEach((key) => {
      const topic = this.topics[key];
      const score = this.overlap(this.prompt.keywords, topic.keywords).length;
      if (score > match.score) {
        match = { score, key }
      }
    });
    
    console.log('+++ Prompt words: ', this.prompt.keywords.join(' '));
    console.log('+++ Match score: ', match.score);
    console.log('+++ Match topic: ', match.key);
   
    return { 
     score: match.score,
     topic: match.key,
     prompt_keywords: this.prompt.keywords,
     response: (match.score < 1) ? this.getResponse(this.topics.def) : this.getResponse(this.topics[match.key])
    };
  }

}
