#!/usr/bin/env node
const yargs = require('yargs')
const { addToIndices } = require('./lib');

const argv = yargs
  .scriptName("capsearch")
  .command(
    'addToIndices <srt>',
    "Index a srt file",
    (yargs)=>{
      return yargs
      .option('uri', {
        alias: 'u',
        describe: 'the video uri',
        demandOption: true,
      })
      .option('output',{
        alias: 'f',
        describe: 'Output file for dry run'
      })
      .option('group',{
        alias: 'g',
        describe: 'Number of captions to be grouped',
        default: 3,
      })
      .option('overlap',{
        alias: 'o',
        describe: 'Number of captions to be overlapped between groups',
        default: 0,
      })
      .option('encoding',{
        alias: 'e',
        describe: 'Caption file encoding',
        default: "UTF-8",
      })
    },
    (argv)=>{
      const {srt, uri, group, overlap, encoding, output} = argv
      addToIndices({captionFile:srt, uri, group, overlap, enc: encoding, outputFile:output})
      .then(()=>{
        console.log('finished')
      })
      .catch((err)=>{
        console.error(err);
      })
    }
  )
  .example('$0 addToIndices mycaption.srt -u https://youtube.com/12345 -g 3 -o 2')
  .help('help')
  .argv
