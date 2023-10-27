export const setCookie = ({ ctx, token }) => {
  ctx.cookies.set(process.env.COOKIE_NAME, token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  });
};
