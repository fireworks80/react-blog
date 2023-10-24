import { User } from '../../models/user.mjs';
import Joi from  'joi';
// 회원 가입
// /api/auth/register
const register = async ctx => { 
  const {username, password} = ctx.request.body;
  
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required()
  });

  const {error} = schema.validate({username, password});

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

      const user = new User({username});

      await user.setPassword(password);
      await user.save();

      ctx.body = user.serialize();
  } catch(e) {
    ctx.throw(500, e);
  }
};

// 로그인
const login = async ctx => { };

// 로그인 상태 확인
const check = async ctx => { };

// 로그아웃
const logout = async ctx => { };

export {register, login, check, logout}