import Responsifier from '../Responsifier';

const l: Library = {
  one: {
    keywords: ['one', 'two', 'three', 'foobar'],
    responses: ['count 1', 'count 2', 'count 3'],
  },
  a: {
    keywords: ['a', 'b', 'c', 'foobar'],
    responses: ['say a', 'say b', 'say c'],
  },
  foo: {
    keywords: ['foobar'],
    responses: ['foo bar!']
  },
  def: {
    keywords: ['default'],
    responses: ['default response'],
  }
};

const tweet: TweetBits = {
  status: 'Magic win count foobar',
  meta: ['counting'],
  user: 'scubblesbot'
}

const tweet2: TweetBits = {
  status: 'rabbit',
  meta: [],
  user: 'scubblesbot'
}

// TESTS
const r = new Responsifier(l, '#dummy');

test('should initialize topics', () => {
  expect(Object.keys(r.topics).length).toEqual(4);
});

test('should extract keywords', () => {
  expect(r.getKeywords(tweet)).toEqual(['magic', 'win', 'count', 'foobar']);
});

test('should calculate array intersections', () => {
  const o = r.overlapScore(['one', 'two'], ['two', 'three', 'four']);
  expect(o).toEqual(1);
});

test('should match prompt to topic', () => {
  expect(r.topicMatch(['one'])).toEqual({ score: 1, key: 'one'});
  expect(r.topicMatch(['a', 'b'])).toEqual({ score: 2, key: 'a'});
});

test('should select a random response and append ps', () => {
  const topic = r.topics['one'];
  global.Math.random = () => 0.1;
  expect(r.getRandomResponse(topic)).toEqual('count 1 #dummy');
  global.Math.random = () => 0.9;
  expect(r.getRandomResponse(topic)).toEqual('count 3 #dummy');
  global.Math.random = () => 0.5;
  expect(r.getRandomResponse(topic)).toEqual('count 2 #dummy');
});

test('should select random topic for matching scores', () => {
  global.Math.random = () => 0.9;
  expect(r.topicMatch(['foobar'])).toEqual({ score: 1, key: 'one'});
  global.Math.random = () => 0.1;
  expect(r.topicMatch(['foobar'])).toEqual({ score: 1, key: 'foo'});
});

test('should get response to tweet', () => {
  global.Math.random = () => 0.1;
  expect(r.respond(tweet)).toEqual({
    score: 1,
    topic: 'foo',
    prompt_keywords: ['magic', 'win', 'count', 'foobar'],
    response: 'foo bar! #dummy'
  });
});

test('should get default response to tweet with no match', () => {
  global.Math.random = () => 0.1;
  expect(r.respond(tweet2)).toEqual({
    score: 0,
    topic: null,
    prompt_keywords: ['rabbit'],
    response: 'default response #dummy'
  });
});
