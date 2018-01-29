import * as w2v from 'word2vector';

export default class Vectorizer {

  empty_vector: number[];

  constructor(path: string) {
    console.time('read');
    w2v.load(path);
    console.timeEnd('read');

    this.empty_vector = w2v.substract(w2v.getVector('dog'), w2v.getVector('dog'));
  }

  public vectorize(word: string): number[] {
    return w2v.getVector(word);
  }

  public addWords(...words: string[]): number[] {
    const vecs = words.map(word => {
      const vec = w2v.getVector(word);
      return vec ? vec : this.empty_vector;
    });
    return vecs.reduce((acc, cur) => w2v.add(acc, cur));
  }

  public avgWords(...words: string[]): number[] {
    let count = words.length;
    const vecs = words.map(word => {
      const vec = w2v.getVector(word);
      if (vec === null) { 
        count--;
        return this.empty_vector;
      }
      return vec;
    });
    const sum = vecs.reduce((acc, cur) => w2v.add(acc, cur));
    return (count === 0) ? this.empty_vector : sum.map(x => x/count);
  }

  public similarity(word1: string | number[], word2: string | number[]): number {
    return w2v.similarity(word1, word2);
  }

}
