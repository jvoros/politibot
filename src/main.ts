import Bot from './Bot';
import config from './config';
import { library } from './Library';
import Responsifier from './Brain/Responsifier';

// Initialize Bots
// const scubbles = new Bot('scubbles', config.scubblesbot);
const utahroger = new Bot('utahroger', config.utahroger);
const repmiabot = new Bot('repmiabot', config.repmiabot);
const brain = new Responsifier(library, '\n\n#miahides #blockmia #utpol');

// Testing Bots
// scubbles.streamMentions('scubblesbot', (tweet) => {
//   const reply = brain.respond(scubbles.extractTweetBits(tweet));
//   scubbles.reply(tweet, reply.response);
// });

// Working Bots
utahroger.streamTweetersTweets(['repmialove', 'miablove'], (tweet) => {
  repmiabot.oldSchoolRetweet(tweet) 
});

repmiabot.streamMentions('repmiabot', (tweet) => {
  const reply = brain.respond(repmiabot.extractTweetBits(tweet));
  repmiabot.reply(tweet, reply.response);
});
