import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

export interface JwtPayload {
  user_id: number;
}

export function guard(req: Request, res: Response, next: NextFunction) {
  let tokenJWT: string | undefined = req.get("Authorization") || req.body.jwt || req.query.jwt;
  tokenJWT = tokenJWT?.startsWith("Bearer ")
    ? tokenJWT.slice(7).trim()
    : tokenJWT;

  if (!tokenJWT) {
    return next(createHttpError(401, "Token JWT is required"));
  }

  const JWT_SECRET = process.env.JWT_SECRET  
  
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment varibales")
  }
  jwt.verify(tokenJWT, JWT_SECRET, (err, payload: unknown) => {
    if (err) {
      return next(createHttpError(401, "Invalid token JWT"));
    }

    if (typeof payload !== "object" || payload === null || !("user_id" in payload)) {
      return next(createHttpError(401, "Invalid token payload"));
    }
     

    req.apiUserId = (payload as JwtPayload).user_id;
    next();
  });
}
