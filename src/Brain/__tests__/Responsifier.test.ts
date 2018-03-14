import Responsifier from '../Responsifier';

const l: Library = {
  one: {
    keywords: ['one', 'two', 'three', 'count'],
    responses: ['count 1', 'count 2', 'count 3'],
  },
  a: {
    keywords: ['a', 'b', 'c'],
    responses: ['say a', 'say b', 'say c'],
  },
  def: {
    keywords: ['default'],
    responses: ['default response'],
  }
};

const tweet: TweetBits = {
  status: 'Magic win count',
  meta: ['counting'],
  user: 'scubblesbot'
}

const tweet2: TweetBits = {
  status: 'medicine alphabet',
  meta: [],
  user: 'scubblesbot'
}

const tweet3: TweetBits = {
  status: 'medicine',
  user: 'scubblesbot',
  meta: []
}

// TESTS
const r = new Responsifier(l, '#dummy');
const resp = r.respond(tweet);

test('should initialize topics', () => {
  expect(Object.keys(r.topics).length).toEqual(3);
});

test('should initialize prompt property for tweet', () => {
  expect(r.prompt.keywords).toEqual(['magic', 'win', 'count']);
  expect(r.prompt.meta).toEqual(['counting']);
  expect(r.prompt.user).toEqual('scubblesbot');
  expect(r.prompt.status).toEqual('Magic win count');
});

test('should calculate array intersections', () => {
  const o = r.overlap(['one', 'two'], ['two', 'three', 'four']);
  expect(o).toEqual(['two']);
  expect(o.length).toEqual(1);
});

test('should get responses based on similarity', () => {
  expect(resp.topic).toEqual('one');
});

// test('should trigger default for match below threshold', () => {
//   w2v.similarity.mockImplementation(() => 0);
//   const resp = r.response(tweet3);
//   expect(resp.resp).toEqual('default response');
// });
