import * as contents from './_contents';

const library = {};

Object.keys(contents).forEach((item) => { 
  library[item] = { 
    keywords: contents[item].keywords.map(word => word.toLowerCase()),
    responses: contents[item].responses 
  };
});

export { library };
