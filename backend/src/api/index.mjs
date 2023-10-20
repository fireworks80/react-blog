import Router from 'koa-router';
const api = new Router();
import { posts } from './posts/index.mjs';

api.use('/posts', posts.routes());



export { api };
