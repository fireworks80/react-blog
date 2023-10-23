import Router from 'koa-router';
const api = new Router();
import { posts } from './posts/index.mjs';
import {auth} from './auth/index.mjs'

api.use('/posts', posts.routes());
api.use('/auth', auth.routes());



export { api };
