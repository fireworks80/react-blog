import Router from 'koa-router';
import { register, login, check, logout } from './auth.ctrl.mjs';
const auth = new Router();

auth.post('/register', register);
auth.post('/login', login);
auth.get('/check', check);
auth.post('/logout', logout);

export { auth };
