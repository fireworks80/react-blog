
import { configDotenv } from 'dotenv';
configDotenv();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import { createFakeData } from './createFakeData.mjs';
import { api } from './api/index.mjs';
import { jwtMiddleware } from './lib/jwtMiddleware.mjs';

const app = new Koa();
const router = new Router();
const { PORT, MONGO_URI } = process.env;

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  // createFakeData();
}).catch((e) => {
  console.error(e);
})


// 라우터 설정
router.use('/api', api.routes());

app.use(bodyParser());
app.use(jwtMiddleware);

// app instance router 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
