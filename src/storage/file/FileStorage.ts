import { Dirent, Stats } from 'fs'
import { DateTime } from 'luxon'
import { FeedContent, FeedEntry, FeedEntryGuess, StorageInterface, dateFromString} from '../storage_interface'
import 'yaml-front-matter'

interface FileStorageSettings{
  path: string
}

export class FileStorage implements StorageInterface {
  options: FileStorageSettings
  files: Array<string>
  data: Array<FeedEntry>

  constructor(){
    this.options = {
      path: "example-feed/2022"
    }
    this.files = []
    this.data = []
    this.updateSource()

  }

  updateSource(): boolean {
    var allFiles = this.findArticlesInDir(this.options.path)
    this.data = allFiles.map(f => {
      return this.getFeedEntryFromFile(f)
    });

    return true
  }

  getEntryById(id: string): FeedEntry {
    return this.data.find(entry => { return entry.id === id })!
  }
  getData(): FeedEntry[] {
    return this.data
  }
  getContentData(id: string): FeedContent {
    var fileName = this.data.find(entry => { return entry.id === id })!
    const path = require('path')
    const fs = require('fs')

    var content: string = fs.readFileSync(path.join(this.options.path, fileName.id))
    const yamlInMarkdown = require('yaml-front-matter')
    var markdown: string = yamlInMarkdown.safeLoadFront(content).__content


    return {
      id: fileName.id,
      title: fileName.title,
      content: markdown
    }
  }
  findArticlesInDir(root: string): Array<string>{
    const path = require('path')
    const fs = require('fs')

    var files: Array<Dirent> = fs.readdirSync(root, {withFileTypes: true})
    return files.filter(dirent => dirent.isFile()).map(dirent=> path.join(root, dirent.name))
  }

  getFeedEntryFromFile(pathToFile: string): FeedEntry {
    const path = require('path')
    const fs = require('fs')

    var fn: string = path.basename(pathToFile)
    var stats: Stats = fs.fstatSync(fs.openSync(pathToFile, 'r'))
    var content: string = fs.readFileSync(pathToFile)
    
    var metadataFromName = this.metadataFromName(fn)
    var metadataFromContent = this.metadataFromContent(content)

    return {
      id: fn,
      title: metadataFromName.title || fn,
      description: undefined,
      author: metadataFromName.author || undefined,
      published: metadataFromName.published || stats.ctime,
      image: undefined
    }
  }


  metadataFromName(file: string): FeedEntryGuess {
    var empty = {
      id: undefined,
      title: undefined,
      description: undefined,
      author: undefined,
      published: undefined,
      image: undefined
    }
    var segments = file.split('_')
    if (segments.length !== 3) {
      return empty
    }
    var datePart = segments[0]
    var authorPart = segments[1]
    var titlePart: string = require('path').basename(segments[2], '.md')

    var isoDate = new Date(Date.parse(datePart))
    var yyyy_mm_dd = DateTime.fromFormat(datePart, "y_M_d").toJSDate()
    var date_guess = isoDate.valueOf() != NaN ? isoDate : yyyy_mm_dd.valueOf() != NaN ? yyyy_mm_dd : undefined

    return {
      id: empty.id,
      title: titlePart.length != 0 ? titlePart : undefined,
      description: undefined,
      author: authorPart.length != 0 ? authorPart : undefined,
      image: undefined,
      published: dateFromString(datePart)
    }
  }

  metadataFromContent(content: string): FeedEntryGuess {
    interface yamlInMarkdownType {
      title: string | undefined
      author: string | undefined
      description: string | undefined
      image: string | undefined
      published: string | undefined
      __content: string
    }

    const yamlInMarkdown = require('yaml-front-matter')
    var metadata: yamlInMarkdownType = yamlInMarkdown.safeLoadFront(content)

    console.log(metadata)

    var markdown: string = metadata.__content.trim()
    var lines = markdown.split("\n")
    var contentTitle = lines[0].startsWith("# ") ? lines[0].substring(1).trim() : undefined
    var contentDesc = lines.find(line => {
      if (line.startsWith("#")) { return false }
      if (line.trim().length === 0 ) { return false }

      return true
    })
    
    return {
      id: undefined,
      title: metadata.title || contentTitle,
      author: metadata.author,
      description: metadata.description || contentDesc,
      image: metadata.image,
      published: metadata.published !== "" && metadata.published !== undefined ? dateFromString(metadata.published) : undefined 
    }
  }
}