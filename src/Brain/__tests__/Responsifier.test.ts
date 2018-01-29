jest.mock('word2vector');

import Responsifier from '../Responsifier';
import Vectorizer from '../Vectorizer';
import * as w2v from 'word2vector';

// MOCKS

w2v.add.mockImplementation((a: number[], b: number[]) => {
  return a.map((v, k) => v + b[k]);
});
w2v.getVector.mockImplementation(() => [1, 2, 3, 4]);

const l: Library = {
  one: {
    keywords: ['one', 'two', 'three'],
    responses: ['count 1', 'count 2', 'count 3'],
    meta: ['counting']
  },
  a: {
    keywords: ['a', 'b', 'c'],
    responses: ['say a', 'say b', 'say c']
  }
};

const tweet: TweetBits = {
  status: 'One two three four Magic counting for the win becuase numbers were removed',
  meta: ['counting'],
  user: 'scubblesbot'
}

// TESTS
const v = new Vectorizer('localhost');
const r = new Responsifier(l, v);

test('should initialize topics', () =>{
  expect(Object.keys(r.topics).length).toEqual(2);
});


test('should get responses based on similarity', () => {
  w2v.similarity
  .mockImplementationOnce(() => 0.2)
  .mockImplementationOnce(() => 0.1);
  expect(r.response(tweet).topic).toEqual('one');
});

test('should boost score for meta matches', () => {
  w2v.similarity.mockImplementation(() => 0.2);
  const resp =  r.response(tweet);
  expect(resp.sim).toEqual(0.4);
});

