import { Post } from '../../models/post.js';
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  try {
    const post = await Post.findById(id);
    console.log('🚀 ~ file: posts.ctrl.js:17 ~ getPostById ~ post:', post);
    if (!post) {
      ctx.status = 404;
      return;
    }

    ctx.state.post = post;

    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;

  if (post.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }

  return next();
};

/*
post 작성
POST /api/posts
{title, body}
*/
const write = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  const { error } = schema.validate(ctx.request.body);

  if (error) {
    ctx.status = 400;
    ctx.body = error;
    return;
  }

  const { title, body, tags } = ctx.request.body;

  const post = new Post({ title, body, tags, user: ctx.state.user });

  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
포스트 목록 조회
GET /api/posts
*/
const list = async (ctx) => {
  const { tag, username, page = 1 } = ctx.query;
  const limit = 10;
  const textMaxLength = 200;

  if (Number(page) < 1) {
    ctx.status = 400;
    return;
  }

  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  const perPage = (Number(page) - 1) * limit;
  const sliceBody = (text) =>
    text.length > textMaxLength ? `${text.slice(0, textMaxLength)}...` : text;

  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .skip(perPage)
      .exec();
    const count = await Post.countDocuments(query).exec();

    ctx.set('Last-Page', Math.ceil(count / limit));
    ctx.body = posts
      .map((post) => post.toJSON())
      .map((post) => ({ ...post, body: sliceBody(post.body) }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
특정 post 조회
GET /api/posts/:id
*/
const read = async (ctx) => {
  ctx.body = ctx.state.post;
};

/*
특정 post 제거
DELETE /api/posts/:id
*/

const remove = async (ctx) => {
  const { id } = ctx.params;

  const index = await Post.findByIdAndDelete({ _id: id });

  if (!index) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }

  ctx.status = 204;
};

/* 
포스트 수정
PATCH /api/posts/:id
{title, body}
*/

const update = async (ctx) => {
  const { id } = ctx.params;
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });
  const { request } = ctx;

  const { error } = schema.validate(request.body);

  if (error) {
    ctx.status = 400;
    ctx.body = error;
    return;
  }

  const post = await Post.findByIdAndUpdate({ _id: id }, request.body, {
    new: true,
  }).exec();

  if (post === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }

  ctx.body = post;
};

export { write, list, read, remove, update };
