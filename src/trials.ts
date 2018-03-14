import * as kw from 'keyword-extractor';

import config from './config';
import { library } from './Library';

import Responsifier from './Brain/Responsifier';

const r = new Responsifier(library, '#dummy');

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
  '@scubblesbot what about @realDonaldTrump and Magic',
];

tests.forEach((test) => {
  const params = {
    language:"english",
    remove_digits: true,
    return_changed_case:true,
    remove_duplicates: false
  };

  console.log(kw.extract(test, params));

  const resp = r.respond({ status: test, meta: ['scubblesbot', 'realdonaldtrump'], user: 'scubblesbot'});
    // console.log('score: ', resp.sim);
    // console.log('topic: ', resp.topic);
    // console.log('keywords: ', resp.prompt_keywords);
  console.log('resp: ', resp.response);
});
