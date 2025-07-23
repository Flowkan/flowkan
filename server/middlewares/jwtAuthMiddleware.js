import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export function guard(req, res, next) {
  let tokenJWT = req.get("Authorization") || req.body.jwt || req.query.jwt;
  tokenJWT = tokenJWT?.startsWith("Bearer ")
    ? tokenJWT.slice(7).trim()
    : tokenJWT;

  if (!tokenJWT) {
    return next(createHttpError(401, "Token JWT is required"));
  }

  jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(createHttpError(401, "Invalid token JWT"));
    }

    req.apiUserId = payload.user_id;
    next();
  });
}
