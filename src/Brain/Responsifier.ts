import config from '../config';
import * as Library from '../Library';
import Topic from './Topic';
import * as Unirest from 'unirest';
import w2v from './Vectorizer';
import Vectorizer from './Vectorizer';

export default class Responsifier {
  
  topics: { [key: string]: Topic };
  vec: Vectorizer;

  constructor(library: Library, vec: Vectorizer) {
    this.vec = vec;
    this.topics = {};
    Object.keys(library).forEach((item) => { 
      const topic = new Topic(vec, library[item].keywords, library[item].responses);
      this.topics[item] = topic;
    });
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

  public async response(phrase: string) {
    const keywords = await this.keywords(phrase);
    // const keywords = phrase.split(' ');
    const prompt= new Topic(this.vec, keywords);
    let match = {
      sim: 0,
      title: null,
      topic: null,
    }
    Object.keys(this.topics).forEach((key) => {
      const topic = this.topics[key];
      const sim = this.vec.similarity(topic.getVector(), prompt.getVector());
      if (sim > match.sim) {
        match.sim = sim;
        match.title = key;
        match.topic = topic;
      }
    });
   return { 
     sim: match.sim,
     topic: match.title,
     prompt_keywords: prompt.keywords,
     resp:  (match.sim < 0.1) ? this.topics.def.getResponse() : match.topic.getResponse(),
    };
  }

}