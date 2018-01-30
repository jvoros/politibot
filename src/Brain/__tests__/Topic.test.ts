jest.mock('word2vector');

import Topic from '../Topic';
import Vectorizer from '../Vectorizer';
import * as w2v from 'word2vector';

w2v.add.mockImplementation((a: number[], b: number[]) => {
  return a.map((v, k) => v + b[k]);
});
w2v.getVector.mockImplementation(() => [1, 2, 3, 4]);
w2v.similarity.mockImplementation(() => 0.75);

const params = { 
  keywords: ['dog', 'cat'],
  meta: ['ilovepets'],
  responses: ['how are you?', 'what up, bro?'] 
};
const t = new Topic(new Vectorizer('localhost'), params);

test('should have no keywords if none passed in', () => {

});

test('should initialize a vector for keywords', () => {
  expect(t.getVector()).toEqual([1,2,3,4]);
});

test('should initialize property for meta words', () => {
  expect(t.getMeta()).toEqual(['ilovepets']);
});

test('should get a random response', () => {
  global.Math.random = () => 0.9;
  expect(t.getResponse()).toEqual('what up, bro?');
  global.Math.random = () => 0.2;
  expect(t.getResponse()).toEqual('how are you?');
});