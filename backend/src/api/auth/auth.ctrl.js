import { User } from '../../models/user.js';
import Joi from 'joi';
// 회원 가입
// /api/auth/register
const register = async (ctx) => {
  const { username, password } = ctx.request.body;

  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate({ username, password });

  if (error) {
    ctx.status = 400;
    ctx.body = error;
    return;
  }

  try {
    const exists = await User.findByUsername(username);

    if (exists) {
      ctx.status = 409;
      return;
    }

    const user = new User({ username });

    await user.setPassword(password);
    await user.save();

    ctx.body = user.serialize();
    const token = user.generateToken();

    ctx.cookies.set(process.env.COOKIE_NAME, token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

// 로그인
// /api/auth/login
const login = async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await User.findByUsername(username);

    if (!user) {
      ctx.status = 401;
      return;
    }

    const valid = await user.checkPassword(password);

    if (!valid) {
      ctx.status = 401;
      return;
    }

    ctx.body = user.serialize();
    const token = user.generateToken();

    ctx.cookies.set(process.env.COOKIE_NAME, token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

// 로그인 상태 확인
const check = async (ctx) => {
  const { user } = ctx.state;

  if (!user) return (ctx.status = 401);

  ctx.body = user;
};

// 로그아웃
const logout = async (ctx) => {};

export { register, login, check, logout };
