import * as unirest from 'unirest';
import config from '../config';

type Stems = string[];
type Response = string;

interface Params {
  keywords?: string[];
  responses?: string[];
  raw?: string;
}

export default class {

  keywords: string[];
  responses: Response[];
  raw: string;
  stems_promise: Promise<void | Stems>;

  constructor(params: Params) {
    this.keywords = params.keywords;
    this.responses = params.responses;
    this.raw = params.raw;
    if (this.keywords) this.stems_promise = this.fetchStems(this.keywords).catch((err) => console.log('--- ERROR: ', err));
    if (this.raw) {
      this.stems_promise = this.fetchKeywords()
        .then(this.fetchStems)
        .catch((err) => console.log('--- ERROR: ', err));
    }
  }

  public fetchKeywords(): Promise<string[]> {
    const body = {
      documents: [{
          language: 'en',
          id: '1',
          text: this.raw
        }]
    }

    return new Promise<string[]>((resolve, reject) => {
      unirest.post('https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases')
      .headers({
        'content-type': 'application/json',
        'Ocp-Apim-Subscription-Key': config.azure.api_key
      })
      .send(JSON.stringify(body))
      .end(resp => { 
        if (resp.status === 200) {
          resolve(resp.body.documents[0].keyPhrases);
        } else {
          reject(resp);
        }
      });
    });
  }

  private fetchStems(keys: string[]): Promise<Stems> {
    return new Promise<Stems>((resolve, reject) => {
      unirest.post('http://text-processing.com/api/stem/')
      .headers({'content-type': 'application/x-www-form-urlencoded'})
      .send(`text=${keys.join(' ')}`)
      .end(resp => { 
        if (resp.status === 200) {
          resolve(resp.body.text.split(' '));
        } else {
          reject(resp);
        }
      });
    });
  }

  public getStems(): Promise<void | Stems> {
    return this.stems_promise;
  }

  public getRandomResponse(): Response | void {
    if (this.responses) return this.responses[Math.floor(Math.random()*this.responses.length)];
    return null;
  }

  public compatabilityScore(other_keywords: Stems): Promise<void | number> {
    // count number of overlaps between this.stems and input_stems
    let score: number = 0;
    return this.getStems().then((stems) => {
      other_keywords.forEach((other) => {
        if(stems && stems.includes(other)) score++;
      });
      return score;
    });
  }
}
