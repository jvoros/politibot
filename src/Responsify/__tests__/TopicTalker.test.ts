import TopicTalker from '../TopicTalker';

const testTalker = new TopicTalker({ 
  keywords: ['one', 'running', 'celebrate'],
  responses: ['how are you?', 'what up, bro?']
});

test('should stem keywords on init', async () => {
  const stems = await testTalker.getStems();
  expect(stems).toEqual(['one', 'run', 'celebr']);
});

test('should get a random response', () => {
  global.Math.random = () => 0.9;
  expect(testTalker.getRandomResponse()).toEqual('what up, bro?');
  global.Math.random = () => 0.2;
  expect(testTalker.getRandomResponse()).toEqual('how are you?');
});

test('should turn raw text into stems', async () => {
  const testTweet = new TopicTalker({ raw: 'The quick brown fox jumps over the lazy dog.'});
  const stems = await testTweet.getStems();
  expect(stems).toEqual(['quick', 'brown', 'fox', 'jump', 'lazi', 'dog']);
})

test('should calc a compatability score', async () => {
  const other_words = ['one', 'run'];
  const score = await testTalker.compatabilityScore(other_words);
  expect(score).toEqual(2);
  const other_words2 = ['yo', 'dude'];
  const score2 = await testTalker.compatabilityScore(other_words2);
  expect(score2).toEqual(0);
});