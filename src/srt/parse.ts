import { Caption } from 'models';
import { toCaption } from './utils';

export function parse(content: string) {
  const caption: Caption[] = []
  return content.split(/\r?\n\s*\r?\n/g).reduce<Caption[]>((captions, part, i) => {
    const caption = toCaption(part);
    return caption ? [...captions, caption] : captions;
  }, caption);
};
