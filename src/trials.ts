import * as kw from 'keyword-extractor';

import config from './config';
import * as Library from './Library';
import Responsifier from './Brain/Responsifier';
import Vectorizer from './Brain/Vectorizer'

const v = new Vectorizer(config.word2vectorModel.path);
const r = new Responsifier(Library, v);

const tests = [
  'Karl malone and john stockton69 in 1969',
  'home improvement involves lots of hammers and nails',
  "immigrants come from mexico that's why we need a wall",
  'Donald Trump was into real estate now he is president',
  'I think the Utes are going to beat BYU',
  'Do you like the cinema?',
  'Deron William and Gordon Hayward were both players who left the team.',
  'I did not do well on my organic chemistry final exam',
  '#botlife @scubblesbot this tweet has meta!!!',
];

tests.forEach((test) => {
  // const params = {
  //   language:"english",
  //   remove_digits: true,
  //   return_changed_case:true,
  //   remove_duplicates: false
  // };

  // console.log(kw.extract(test, params));

  const resp = r.response({ status: test, meta: [], user: 'scubblesbot'});
    // console.log('score: ', resp.sim);
    // console.log('topic: ', resp.topic);
    // console.log('keywords: ', resp.prompt_keywords);
  console.log('resp: ', resp.resp);
});

console.log('@realDonaldTrump', v.vectorize('@realDonaldTrump'));
console.log('#botlife', v.vectorize('#botlife'));