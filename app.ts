import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { NewsFeed } from './src/feeds/feed'
import { marked } from 'marked'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.static('public'))

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
app.get('/articles/:articleId', (req: Request, res: Response) => {
  var content: string = NewsFeed.getEntryById(req.params.articleId).content
  marked.parse("", )
  res.send(marked.parse(content))
});


app.get('/rss', (req: Request, res: Response) => {
  res.send(NewsFeed.getFeed().rss2());
});
app.get('/atom', (req: Request, res: Response) => {
  res.send(NewsFeed.getFeed().atom1());
});
app.get('/json', (req: Request, res: Response) => {
  res.send(NewsFeed.getFeed().json1());
});


app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
