import Router from 'koa-router';
const api = new Router();
import { posts } from './posts/index.js';
import { auth } from './auth/index.js';

api.use('/posts', posts.routes());
api.use('/auth', auth.routes());

export { api };
