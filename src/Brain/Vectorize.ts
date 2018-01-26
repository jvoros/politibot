import * as w2v from 'word2vector';

class Vectorizer {

  empty_vector: number[];

  constructor(path: string) {
    console.time('read');
    w2v.load(path);
    console.timeEnd('read');

    this.empty_vector = w2v.substract(w2v.getVector('dog'),w2v.getVector('dog'));
  }

  vectorize(word: string): number[] {
    return w2v.getVector(word);
  }

  addWords(...words: string[]): number[] {
    const vecs = words.map(word => {
      const vec = w2v.getVector(word);
      return vec ? vec : this.empty_vector;
    });
    return vecs.reduce((acc, cur) => w2v.add(acc, cur));
  }

  similarity(word1: string | number[], word2: string | number[]): number[] {
    return w2v.similarity(word1, word2);
  }

}

const model_file = './wordvectors/GoogleNews-vectors-negative300-SLIM.bin';
const instance: Vectorizer = new Vectorizer(model_file);

export default instance;
