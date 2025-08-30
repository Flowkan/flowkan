import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

export interface JwtPayload {
  user_id: string;
}

export function guard(req: Request, res: Response, next: NextFunction) {
  let tokenJWT: string | undefined = req.get("Authorization") || req.body.jwt || req.query.jwt;
  tokenJWT = tokenJWT?.startsWith("Bearer ")
    ? tokenJWT.slice(7).trim()
    : tokenJWT;

  if (!tokenJWT) {
    return next(createHttpError(401, "Token JWT is required"));
  }

  jwt.verify(tokenJWT, process.env.JWT_SECRET as string, (err, payload) => {
    if (err) {
      return next(createHttpError(401, "Invalid token JWT"));
    }

    req.apiUserId = (payload as JwtPayload).user_id;
    next();
  });
}
