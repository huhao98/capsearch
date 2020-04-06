import { Caption } from 'models';

export function toMilliseconds(s: string) {
  var match = /^\s*(\d{1,2}):(\d{1,2}):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(s);
  if(!match){
    throw new Error('not a valid ms string');
  }
  var hh = parseInt(match[1]);
  var mm = parseInt(match[2]);
  var ss = parseInt(match[3]);
  var ff = match[5] ? parseInt(match[5]) : 0;
  var ms = hh * 3600 * 1000 + mm * 60 * 1000 + ss * 1000 + ff;
  return ms;
}

export function toTimeString(ms: number) {
  var hh = Math.floor(ms / 1000 / 3600);
  var mm = Math.floor(ms / 1000 / 60 % 60);
  var ss = Math.floor(ms / 1000 % 60);
  var ff = Math.floor(ms % 1000);
  var time = (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss + "," + (ff < 100 ? "0" : "") + (ff < 10 ? "0" : "") + ff;
  return time;
}

export function toCaption (part: string): Caption | undefined {
  const eol = "\n"
  const regex = /^(\d+)\r?\n(\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?)\s*\-\-\>\s*(\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?)\r?\n([\s\S]*)(\r?\n)*$/gi;
  var match = regex.exec(part);
  if (match) {
    const start: number = toMilliseconds(match[2]);
    const end: number = toMilliseconds(match[4]);
    const lines = match[6].split(/\r?\n/);
    let content = lines.join(eol);
    content = content
      .replace(/\<[^\>]+\>/g, "") //<b>bold</b> or <i>italic</i>
      .replace(/\{[^\}]+\}/g, "") //{b}bold{/b} or {i}italic{/i}
      .replace(/\>\>\s*[^:]*:\s*/g, ""); //>> SPEAKER NAME:

    return {
      start,
      end,
      duration: end - start,
      content: content,
    } as Caption
  }
}
