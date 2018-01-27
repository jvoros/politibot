jest.mock('word2vector');

import Topic from '../Topic';
import Vectorizer from '../Vectorizer';
import * as w2v from 'word2vector';

w2v.add.mockImplementation((a: number[], b: number[]) => {
  return a.map((v, k) => v + b[k]);
});
w2v.getVector.mockImplementation(() => [1, 2, 3, 4]);
w2v.similarity.mockImplementation(() => 0.75);

const v = new Vectorizer('localhost');
const t = new Topic(v, ['dog', 'cat'], ['how are you?', 'what up, bro?']);

test('should initialize a vector for keywords', () => {
  
  expect(t.getVector()).toEqual([1,2,3,4]);
});

test('should get a random response', () => {
  global.Math.random = () => 0.9;
  expect(t.getResponse()).toEqual('what up, bro?');
  global.Math.random = () => 0.2;
  expect(t.getResponse()).toEqual('how are you?');
});