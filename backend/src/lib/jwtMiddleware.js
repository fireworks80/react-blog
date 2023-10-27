import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { setCookie } from '../lib/setCookie.js';

const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get(process.env.COOKIE_NAME);

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = {
      _id: decoded._id,
      username: decoded.username,
    };
    console.log(
      '🚀 ~ file: jwtMiddleware.mjs:8 ~ jwtMiddleware ~ decoded:',
      decoded,
    );

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      const user = await User.findById(decoded._id);

      setCookie({ ctx, token: user.generateToken() });
    }

    return next();
  } catch (e) {
    return next();
  }
};

export { jwtMiddleware };
