const Bot = require('./src/Bot');
const config = require('./config');

const scubbles = new Bot('scubbles', config.scubblesbot);
//const utahroger = new Bot('utahroger', config.utahroger);


// testing bots
// scubbles.streamTweeterTweets('rogerrogerbot', (tweet) => {
//   console.log(tweet);
// });

//scubbles.getUsersIds(['scubblesbot', 'utahroger']).then((x) => console.log(x));

// scubbles.getSomeTweetersTweets('rogerrogerbot', { count: 10 }, (err, data, response) => {
//   data.forEach((tweet) => console.log(tweet.id));
//   console.log('newest tweet id: ', data[0].id);
// });

// working bots
// utahroger.streamTweeterTweets('twoheadlines', (tweet) => {
//   scubbles.oldSchoolRetweet(tweet) 
// });


