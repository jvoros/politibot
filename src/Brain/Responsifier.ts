import * as stopword from 'stopword';
import * as Unirest from 'unirest';
import Vectorizer from './Vectorizer';

import config from '../config';
import * as Library from '../Library';
import Topic from './Topic';

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
    console.log('INTIALIZED Brain');
  }

  public keywords(phrase: string): Promise<string[]> {
    const body = {
      documents: [{
          language: 'en',
          id: '1',
          text: phrase
        }]
    }
    
    return new Promise<string[]>((resolve, reject) => {
      const req = Unirest('POST', 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases');
      req.headers({
        'content-type': 'application/json',
        'Ocp-Apim-Subscription-Key': config.azure.api_key
      })
      req.send(JSON.stringify(body))
      req.end(resp => { 
        if (resp.status === 200) {
          resolve(resp.body.documents[0].keyPhrases.join(' ').split(' '));
        } else {
          reject(resp);
        }
      });
    });
  }

  public setPrompt(tweet: TweetBits): Promise<boolean> {
    const { status, meta, user } = tweet;
    return this.keywords(status)
      .then(keywords_api => {
        let keywords;
        if (keywords_api.length > 2) {
          keywords = keywords_api;
        } else {
          const no_stops = stopword.removeStopwords(status.split(' '));
          keywords = no_stops.map((word) => word.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," "));
        }

        this.prompt = new Topic(this.vec, { keywords, meta });
        return true;
      })
      .catch(err => { 
        console.log('--- ERR: ', err);
        return false;
      });
  }

  public async response(tweet: TweetBits) {
    const set = await this.setPrompt(tweet);
    // const keywords = phrase.split(' ');
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
     resp:  (match.sim < 0.1) ? this.topics.def.getResponse() : match.topic.getResponse(),
    };
  }

}
