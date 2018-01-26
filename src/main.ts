import Bot from './Bot';
import config from './config';
import * as Library from './Library';
import Responsifier from './Brain/Responsifier';
import Vectorizer from './Brain/Vectorizer'

const scubbles = new Bot('scubbles', config.scubblesbot);
const utahroger = new Bot('utahroger', config.utahroger);

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

const v = new Vectorizer(config.word2vectorModel.path);
const r = new Responsifier(Library, v);

r.response('Do you think Utah or BYU will win the game?')
  .then((resp) => console.log(resp))
  .catch(err => { console.log(err) });