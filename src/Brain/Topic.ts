import Vectorizer from './Vectorizer';

export default class Topic {

  readonly keywords: string[];
  readonly meta: string[];
  readonly responses: string[];
  readonly vector: number[];

  constructor(w2v: Vectorizer, topic: TopicDef ) {
    this.keywords = (topic.keywords) ? topic.keywords.join(' ').split(' ') : [];
    this.meta = (topic.meta) ? topic.meta : [];
    this.responses = (topic.responses) ? topic.responses : [];
    this.vector = w2v.avgWords(...this.keywords);
  }

  getResponse() {
    return this.responses[Math.floor(Math.random()*this.responses.length)];
  }

  getVector() {
    return this.vector;
  }

  getMeta() {
    return this.meta;
  }

  getKeywords() {
    return this.keywords;
  }
 
}
