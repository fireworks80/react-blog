import Router from 'koa-router';
import { checkLoggedIn } from '../../lib/checkLoggedIn.js';
import {
  list,
  write,
  read,
  remove,
  update,
  getPostById,
  checkOwnPost,
} from './posts.ctrl.js';
const posts = new Router();

posts.get('/', list);
posts.post('/', checkLoggedIn, write);
posts.get('/:id', getPostById, read);
posts.delete('/:id', getPostById, checkOwnPost, remove);
posts.patch('/:id', getPostById, checkOwnPost, update);

// const post = new Router();
// post.get('/', read);
// post.delete('/', checkOwnPost, remove);
// post.patch('/', checkOwnPost, update);

// posts.use('/:id', getPostById, post.router());

export { posts };
