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
    meta: ['counting', 'numbers']
  },
  a: {
    keywords: ['a', 'b', 'c'],
    responses: ['say a', 'say b', 'say c']
  },
  def: {
    keywords: ['default'],
    responses: ['default response'],
  }
};

const tweet: TweetBits = {
  status: 'Magic win counting',
  meta: ['counting'],
  user: 'scubblesbot'
}

const tweet2: TweetBits = {
  status: 'medicine',
  meta: [],
  user: 'scubblesbot'
}

// TESTS
const v = new Vectorizer('localhost');
const r = new Responsifier(l, v);
// const resp = r.response(tweet);

test('should initialize topics', () => {
  expect(Object.keys(r.topics).length).toEqual(3);
});

test('should initialize prompt property for tweet', () => {
  w2v.similarity.mockImplementation(() => 0.2);
  const resp = r.response(tweet);
  expect(r.prompt.getKeywords()).toEqual(['magic', 'win', 'counting']);
  expect(r.prompt.getMeta()).toEqual(['counting']);
})

test('should get responses based on similarity', () => {
  w2v.similarity
  .mockImplementationOnce(() => 0.2)
  .mockImplementationOnce(() => 0.1)
  .mockImplementation(() => 0.2);
  expect(r.response(tweet).topic).toEqual('one');
});

test('should boost score for meta matches', () => {
  w2v.similarity.mockImplementation(() => 0.09);
  const resp = r.response(tweet);
  expect(resp.sim).toEqual(0.19);
});

test('should trigger default for match below threshold', () => {
  w2v.similarity.mockImplementation(() => 0);
  const resp = r.response(tweet2);
  expect(resp.resp).toEqual('default response');
});
