jest.mock('word2vector');

import config from '../../config';
import Vectorizer from '../Vectorizer';
import * as w2v from 'word2vector';

w2v.add.mockImplementation((a: number[], b: number[]) => {
  return a.map((v, k) => v + b[k]);
});
w2v.getVector.mockImplementation(() => [1, 2, 3, 4]);
w2v.similarity.mockImplementation(() => 0.75);

const v = new Vectorizer(config.word2vectorModel.path);
v.empty_vector = [0,0,0,0];

test('should vectorize words', () => {
  expect(v.vectorize('dog')).toEqual([1, 2, 3, 4]);
});

test('should add word vectors', () => {
  expect(v.addWords('dog', 'cat')).toEqual([2,4,6,8]);
});

test('should add word vectors even if word not found', () => {
  w2v.getVector
  .mockImplementationOnce(() => [1,2,3,4])
  .mockImplementationOnce(() => null);
  expect(v.addWords('dog', 'cat')).toEqual([1,2,3,4]);
});

test('should calculate similarities of vectors', () => {
  const sim = v.similarity(v.vectorize('dog'), v.vectorize('cat'));
  expect(sim).toEqual(0.75);
});
