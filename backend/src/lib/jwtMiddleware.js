import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

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

    // const now = Math.floor(Date.now() / 1000);
    // if (decoded.exp - now < 60 * 60 * 24 * 7) {
    //   const user = await User.findById(decoded._id);
    //   const token = user.generateToken();
    //   ctx.cookies.set(process.env.COOKIE_NAME, token, {
    //     maxAge: 1000 * 60 * 60 * 24 * 7,
    //     httpOnly: true,
    //   });
    // }
    return next();
  } catch (e) {
    return next();
  }
};

export { jwtMiddleware };
