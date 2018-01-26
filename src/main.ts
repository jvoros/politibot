import Bot from './Bot';
import config from './config';
import Library from './Brain/Responsifier';
import TopicTools from './Brain/TopicTools';
import { performance } from 'perf_hooks';

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

// const raw_tweet = "The quick brown fox jumps over the lazy dog";
//const x = new TopicTools({raw: raw_tweet});

// console.log(Library());

// working bots
// utahroger.streamTweeterTweets('twoheadlines', (tweet) => {
//   scubbles.oldSchoolRetweet(tweet) 
// });


// class testing {
//   connection: Promise<string>;
//   constructor() {
//     this.connection = this.establishConnection();
//   }

//   establishConnection() {
//     // simulate slow connection setup by initializing after 2 seconds
//     return new Promise<string>(resolve => setTimeout(() => {
//       resolve('connection established');
//     }, 5000));
//   }
//   async doSomethingRemote(): Promise<string> {
//     const x = await this.connection;
//     console.log('doSomethingRemote says: ', x);
//     return x;
//   }
// }

// function promiseTime(start) {
//   console.log('Execution time: ', (performance.now()-start)/1000);
// }

// const t0 = performance.now();
// const x = new testing;
// x.doSomethingRemote().then((x) => { promiseTime(t0); });
// x.doSomethingRemote().then((x) => { promiseTime(t0); });
