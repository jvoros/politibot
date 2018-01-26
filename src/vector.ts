import * as w2v from 'word2vector';
import config from './config';

// const model_file = './wordvectors/GoogleNews-vectors-negative300-SLIM.bin';

console.time('read');
w2v.load(config.word2vectorModel.path);
console.timeEnd('read');

const empty_vec = w2v.substract(w2v.getVector('dog'),w2v.getVector('dog'));

function vecAdd(words: string[]) {
  const vecs = words.map(word => {
    const vec = w2v.getVector(word);
    return vec ? vec : empty_vec;
  });
  return vecs.reduce((acc, cur) => w2v.add(acc, cur));
}

function vecAvg(words: string[]) {
  let count = words.length+1;
  const vecs = words.map(word => {
    const vec = w2v.getVector(word);
    if (vec === null) {
      count--;
      return empty_vec;
    } else {
      return vec;
    }
  });
  const sum = vecs.reduce((acc, cur) => w2v.add(acc, cur));
  const avg = sum.map((x) => x/count);
  return avg;
}

const dog = w2v.getVector('dog');
const cat = w2v.getVector('cat');
const electron = w2v.getVector('electron');
const chemistry = w2v.getVector('chemistry');

const dog_cat = w2v.add(dog, cat);
const electron_chemistry = w2v.add(electron, chemistry);
const animals = vecAdd(['dog', 'cat', 'bird', 'fish', 'rabbit']);

console.log('dog_cat and dog: ', w2v.similarity(dog_cat, dog));
console.log('e_c and electron: ', w2v.similarity(electron_chemistry, electron));
console.log('dog_cat and electron', w2v.similarity(dog_cat, electron));
console.log('dog and animals', w2v.similarity(animals, dog));
console.log('dog and cat', w2v.similarity(dog, cat));
console.log('up and above: ', w2v.similarity('up', 'above'));
console.log('dog_cat and e_c: ', w2v.similarity(dog_cat, electron_chemistry));

const sent1 = vecAdd(['eat', 'watermelon', 'summer']);
const sent2 = vecAdd(['drink', 'lemonade', 'autumn']);
const sent3 = vecAdd(['raise', 'taxes', 'wealthy']);

console.log('watermelon lemonade: ', w2v.similarity(sent1, sent2));
console.log('watermelon politics: ', w2v.similarity(sent1, sent3));

const dog_cat_avg = vecAvg(['dog', 'cat']);
console.log('dog_cat_avg, dog: ', w2v.similarity(dog_cat_avg, dog));

console.log('SUBTRACT TEST');
const dog_minus_cat = w2v.substract(dog, cat);
console.log('dog_minus_cat and zero: ', w2v.similarity(dog_minus_cat, empty_vec));
const dog_minus_electron = w2v.substract(dog, electron);
console.log('dog_minus_electron and zero: ', w2v.similarity(dog_minus_electron, empty_vec));