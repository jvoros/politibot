import Vectorizer from './Vectorizer';

export default class Topic {

  readonly keywords: string[];
  readonly responses: string[];
  readonly vector: number[];

  constructor(w2v: Vectorizer, keywords: string[], responses?: string[] ) {
    this.keywords = keywords.join(' ').split(' ');
    this.responses = responses;
    this.vector = w2v.addWords(...this.keywords);
  }

  getResponse() {
    return this.responses[Math.floor(Math.random()*this.responses.length)];
  }

  getVector() {
    return this.vector;
  }

}
