import * as fs from 'fs';
import * as path from 'path';
import * as srt from './srt';
import { decode } from 'iconv-lite';
import { Caption, CaptionRecord } from 'models';
import { createHash } from 'crypto';
import algoliasearch from 'algoliasearch';

export type AddToIndicesOption = {
  uri: string,
  captionFile: string,
  outputFile?: string,
  group?: number,
  overlap?: number,
  enc?: string,
}

export async function addToIndices(options: AddToIndicesOption) {
  const { uri, captionFile, outputFile, group = 3, overlap = 0, enc = "UTF-8" } = options;
  const captions = parseSRT(captionFile, enc);
  const records = getRecords(captions, uri, group, overlap);
  if(outputFile){
    console.log(`Write index to json ${outputFile}`);
    writeRecords(outputFile, records);
  }else{
    console.log(`Start indexing ${records.length} records`);
    await indexRecords(records);
    console.log('Index success');
  }
}

/**
 * Add records to Algolia Index
 * @param records
 */
async function indexRecords(records: CaptionRecord[]){
  const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = process.env;
  if(!(ALGOLIA_APP_ID && ALGOLIA_API_KEY && ALGOLIA_INDEX)){
    throw new Error('Missing Configuration!');
  }

  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
  const index = client.initIndex(ALGOLIA_INDEX);
  await index.saveObjects(records, { autoGenerateObjectIDIfNotExist: false })
}

function writeRecords(jsonFile: string, records: CaptionRecord[]){
  const file = path.resolve(process.cwd(), jsonFile);
  const content = JSON.stringify(records);
  fs.writeFileSync(file, content, {encoding: 'utf8', flag: 'w'});
}

/**
 * Parse srt file
 * @param captionFile
 * @param encoding
 */
function parseSRT(captionFile: string, encoding: string){
  const file = path.resolve(process.cwd(), captionFile);
  if (!fs.existsSync(file))
    throw new Error('File not exist');

  const buffer = fs.readFileSync(file);
  const content = decode(buffer, encoding);
  return srt.parse(content);
}

/**
 * Convert captions to records
 * @param captions
 * @param uri
 * @param group
 * @param overlap
 */
function getRecords(captions: Caption[], uri: string, group: number, overlap: number) : CaptionRecord[] {
  function getHashedId(uri: string, caption: Caption) {
    const data = `${uri}${caption.start}${caption.end}`;
    return createHash("sha1").update(data).digest('base64');
  }

  function* grouping(captions: Caption[], len = 3, overlap = 0) {
    const step = Math.max(len - overlap, 1);
    for (var i = 0; i < captions.length; i = i + step) {
      const buffer = captions.slice(i, i + len);
      const start = buffer[0].start;
      const end = buffer[buffer.length - 1].end;
      const caption: Caption = {
        start,
        end,
        duration: end - start,
        content: buffer.map((item) => item.content).join('\n')
      }
      yield (caption);
    }
  }

  const result: Array<CaptionRecord> = []
  for (let caption of grouping(captions, group, overlap)) {
    result.push({
      objectID: getHashedId(uri, caption),
      uri,
      ...caption
    });
  }
  return result;
}




