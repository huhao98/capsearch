export type Caption = {
  start: number,
  end: number,
  duration: number,
  content: string,
}

export type CaptionRecord =  {
  objectID: string,
  uri: string,
} & Caption
