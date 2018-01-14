const Bot = require('./src/Bot');
const config = require('./config');

const scubbles = new Bot('scubbles', config.scubblesbot);
const utahroger = new Bot('utahroger', config.utahroger);

utahroger.streamTweeterTweets(`${config.twoheadlines.id}`, (tweet) => {
  scubbles.oldSchoolRetweet(tweet) 
});

// scubbles.getSomeTweetersTweets('rogerrogerbot', { count: 10 }, (err, data, response) => {
//   data.forEach((tweet) => console.log(tweet.id));
//   console.log('newest tweet id: ', data[0].id);
// });
