import { StorageInterface, FeedEntry, FeedContent } from "../storage_interface";
export class MemoryStorage implements StorageInterface {
  data = [
    {
      id: "hello",
      published: undefined,
      image: undefined,
      author: "buc",
      title: "Hello World",
      description: "abstract",
      content: "# Hello World\n\nabscract\n\nThis is the Markdown Content if the Entry"
    }
  ]
  

  updateSource(): boolean {
    return true
  }
  getEntryById(id: string): FeedEntry {
    return this.data.find( entry => { return entry.id === id })!
  }
  getData(): FeedEntry[] {
    return this.data
  }
  getContentData(id: string): FeedContent {
    return this.data.find(entry => { return entry.id === id })!
  }

}