import { Caption } from 'models';
import { toCaption } from './utils';

export function parse(content: string) {
  const segments = content.split(/\r?\n\s*\r?\n/g);
  console.log(`Found ${segments.length} srt segments...`);
  return segments.reduce<Caption[]>((captions, part, i) => {
    const caption = toCaption(part);
    if(!caption){
      console.log('unknow srt segment at', i);
    }
    return caption ? [...captions, caption] : captions;
  }, []);
};
