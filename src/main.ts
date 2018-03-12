import Bot from './Bot';
import config from './config';
import * as Library from './Library';
import Responsifier from './Brain/Responsifier';
import Vectorizer from './Brain/Vectorizer'

// Initialize Bots
const scubbles = new Bot('scubbles', config.scubblesbot);
const utahroger = new Bot('utahroger', config.utahroger);
const repmiabot = new Bot('repmiabot', config.repmiabot);
const brain = new Responsifier(Library, new Vectorizer(config.word2vectorModel.path));

// Working Bots
utahroger.streamTweetersTweets(['repmialove', 'miablove'], (tweet) => {
  repmiabot.oldSchoolRetweet(tweet) 
});

repmiabot.streamMentions('repmiabot', (tweet) => {
  const reply = brain.response(repmiabot.extractTweetBits(tweet));
  repmiabot.reply(tweet, reply.resp);
});