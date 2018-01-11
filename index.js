const Bot = require('./src/Bot');
const config = require('./config');

const scubbles = new Bot('scubbles', config.scubblesbot);
scubbles.streamTweetersTweets(config.rogerrogerbot.id, (tweet) => {
  scubbles.manualRetweet(tweet) 
});
