import Bot from './Bot';
import config from './config';
import * as Library from './Library';
import Responsifier from './Brain/Responsifier';
import Vectorizer from './Brain/Vectorizer'

// Initialize Bots
const scubbles = new Bot('scubbles', config.scubblesbot);
const utahroger = new Bot('utahroger', config.utahroger);
const brain = new Responsifier(Library, new Vectorizer(config.word2vectorModel.path));

// Working Bots
utahroger.streamTweetersTweets(['twoheadlines'], (tweet) => {
  scubbles.oldSchoolRetweet(tweet) 
});

scubbles.streamMentions('scubblesbot', (tweet) => {
  const reply = brain.response(scubbles.extractTweetBits(tweet));
  scubbles.reply(tweet, reply.resp);
});