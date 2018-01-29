import * as KeywordExtractor from 'keyword-extractor';

import config from '../config';
import * as Library from '../Library';
import Topic from './Topic';
import Vectorizer from './Vectorizer';

export default class Responsifier {
  
  prompt: Topic;
  topics: { [key: string]: Topic };
  vec: Vectorizer;

  constructor(library: Library, vec: Vectorizer) {
    this.vec = vec;
    this.topics = {};
    Object.keys(library).forEach((item) => { 
      const topic = new Topic(vec, { keywords: library[item].keywords, meta: library[item].meta, responses: library[item].responses });
      this.topics[item] = topic;
    });
    console.log('INTIALIZED Brain...');
  }

  public setPrompt(tweet: TweetBits): void {
    const { status, meta, user } = tweet;
    const params = {
      language:"english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false
    };
    const keywords = KeywordExtractor.extract(status, params);
    this.prompt = new Topic(this.vec, { keywords, meta });
  }

  public response(tweet: TweetBits) {
    this.setPrompt(tweet);
    
    let match = {
      sim: 0,
      title: null,
      topic: null,
    }

    // compare topics to prompt
    Object.keys(this.topics).forEach((key) => {
      const topic = this.topics[key];
      let sim = this.vec.similarity(topic.getVector(), this.prompt.getVector());
      
      // add 0.2 to similarity result for every meta match
      if (topic.getMeta().length > 0) { 
        topic.meta.forEach(term => {
          if (this.prompt.getMeta().includes(term)) {
            sim = sim + 0.2;
          }
        });
      }
      
      if (sim > match.sim) {
        match.sim = sim;
        match.title = key;
        match.topic = topic;
      }
    });
    
    console.log('+++ Prompt words: ', this.prompt.keywords.join(' '));
    console.log('+++ Match score: ', match.sim);
    console.log('+++ Match topic: ', match.title);
   
    return { 
     sim: match.sim,
     topic: match.title,
     prompt_keywords: this.prompt.keywords,
     resp:  (match.sim < 0.11) ? this.topics.def.getResponse() : match.topic.getResponse(),
    };
  }

}
