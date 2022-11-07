import { DateTime } from "luxon";

export interface StorageInterface {
  updateSource(): boolean;
  getEntryById(id: string): FeedEntry
  getData(): Array<FeedEntry>
  getContentData(id: string): FeedContent 
}

export interface FeedEntry {
  id: string
  title: string
  description: string | undefined
  author: string | undefined
  published: Date | undefined
  image: string | undefined
}

export interface FeedEntryGuess {
  id: string | undefined
  title: string | undefined
  description: string | undefined
  author: string | undefined
  published: Date | undefined
  image: string | undefined
}

export interface FeedContent {
  id: string
  title: string
  content: string
}


export function dateFromString(dateAsString: string): Date | undefined {
  var isoDate = new Date(Date.parse(dateAsString))
  var yyyy_mm_dd = DateTime.fromFormat(dateAsString, "y_M_d").toJSDate()
  var date_guess = isoDate.valueOf() != NaN ? isoDate : yyyy_mm_dd.valueOf() != NaN ? yyyy_mm_dd : undefined

  return date_guess
}