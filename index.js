const Bot = require('./src/Bot');
const config = require('./config');

const scubbles = new Bot(config.scubblesbot);
scubbles.streamTweetersTweets(config.rogerrogerbot.id, (tweet) => { 
  console.log('scubbles received a tweet.');
  const status = scubbles.extractTweetText(tweet);
  console.log('status: ', status);
  const rt = scubbles.manualRetweet(status, 'RT @rogerrogerbot: ');
});
