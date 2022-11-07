import { Feed   } from "feed"
import { MemoryStorage } from "../storage/memory/MemoryStorage";
import { FileStorage } from "../storage/file/FileStorage"
import { FeedContent, FeedEntry, StorageInterface } from "../storage/storage_interface"



class NewsFeedImpl {
  feedObj = new Feed({
    title: "Company News Feed",
    description: "Example Feed",
    id: "http://example.com/",
    link: "http://example.com/",
    image: "http://example.com/image.png",
    favicon: "http://example.com/favicon.ico",
    copyright: "All rights reserved 2013, John Doe",
    updated: new Date(), // optional, default = today
    generator: "news-feed", // optional, default = 'Feed for Node.js'
    feedLinks: {
      json: "https://example.com/json",
      rss: "https://example.com/rss",
      atom: "https://example.com/atom"
    },
    author: {
      name: "John Doe",
      email: "johndoe@example.com",
      link: "https://example.com/johndoe"
    }
  });
  storage: StorageInterface


  constructor(storage: StorageInterface){
    this.storage = storage
    storage.getData().forEach(article => {
      this.addEntryToFeed(article)
    });
  }

  addEntryToFeed (data: FeedEntry){
    this.feedObj.addItem({
      id: data.id,
      title: data.title,
      link: "articles/"+data.id,
      description: data.description,
      image: data.image,
      date: data.published || new Date(),
      author: [
        {
          name: data.author || this.feedObj.options.author?.name || "unknown"
        }
      ]
    });
    // update the LastUpdated field with the most recent RSS Entry
    if (data.published !== undefined && (this.feedObj.options.updated || new Date() < data.published)) {
      this.feedObj.options.updated = data.published
    }
  }

  getFeed() {
    return this.feedObj
  }

  getEntryById(id: string): FeedContent {
    return this.storage.getContentData(id)
  }

}

// var memory = new MemoryStorage()
var file = new FileStorage()
export const NewsFeed = new NewsFeedImpl(file)