import Bot from './Bot';
import config from './config';
import * as Library from './Library';
import Responsifier from './Brain/Responsifier';
import Vectorizer from './Brain/Vectorizer'

// Initialize Bots
const scubbles = new Bot('scubbles', config.scubblesbot);
const utahroger = new Bot('utahroger', config.utahroger);
const brain = new Responsifier(Library, new Vectorizer(config.word2vectorModel.path));

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
