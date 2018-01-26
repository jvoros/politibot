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
w2v.similarity.mockImplementation(() => 0.75);

const l: Library = {
  one: {
    keywords: ['one', 'two', 'three'],
    responses: ['count 1', 'count 2', 'count 3']
  },
  a: {
    keywords: ['a', 'b', 'c'],
    responses: ['say a', 'say b', 'say c']
  }
};

// TESTS
const v = new Vectorizer('localhost');
const r = new Responsifier(l, v);

test('should initialize topics', () =>{
  expect(r.topics.length).toEqual(2);
});

test('should fetch keywords for a phrase', async () => {
  const k = await r.keywords('hello world');
  expect(k).toEqual(['quick', 'brown', 'fox']);
});