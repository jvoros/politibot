jest.mock('word2vector');
jest.mock('unirest');

import Responsifier from '../Responsifier';
import Vectorizer from '../Vectorizer';
import * as w2v from 'word2vector';
import * as Unirest from 'unirest';

// MOCKS
Unirest.mockImplementation(() => ({
  headers: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  end: jest.fn((cb) => cb({
    status: 200,
    body: {
      "documents": [
        {
          "keyPhrases": [
            "quick",
            "brown",
            "fox"
          ],
          "id": "1"
        }
      ],
      "errors": []
    }
  }))
})); 

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
  status: 'One two three four',
  meta: ['counting'],
  user: 'scubblesbot'
}

// TESTS
const v = new Vectorizer('localhost');
const r = new Responsifier(l, v);

test('should initialize topics', () =>{
  expect(Object.keys(r.topics).length).toEqual(2);
});

test('should fetch keywords for a phrase', async () => {
  const k = await r.keywords('hello world');
  expect(k).toEqual(['quick', 'brown', 'fox']);
});

test('should set prompt keywords to status text if api returns fewer than 3 words', async () => {
  
  Unirest.mockImplementation(() => ({
    headers: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn((cb) => cb({
      status: 200,
      body: {
        "documents": [
          {
            "keyPhrases": [
              "quick",
              "brown"
            ],
            "id": "1"
          }
        ],
        "errors": []
      }
    }))
  }));
  
  const run = await r.setPrompt(tweet);
  expect(r.prompt.getKeywords()).toEqual(['One', 'two', 'three', 'four']);
});

test('should get responses based on similarity', async () => {
  w2v.similarity
  .mockImplementationOnce(() => 0.2)
  .mockImplementationOnce(() => 0.1);
  const resp = await r.response(tweet);
  expect(resp.topic).toEqual('one');
});

test('should boost score for meta matches', async () => {
  w2v.similarity.mockImplementation(() => 0.2);
  const resp = await r.response(tweet);
  expect(resp.sim).toEqual(0.4);
});

