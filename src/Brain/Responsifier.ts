import TopicTools from './TopicTools';
import * as Library from '../Library';
import { TopicDef } from '../Library/_types';

interface Library {
  [key: string]: TopicDef;
}

export default function(): Library {
  return Library;
}
