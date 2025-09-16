import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

export interface JwtPayload {
  userId: number;
}

export function guard(req: Request, res: Response, next: NextFunction) {
  let tokenJWT: string | undefined =
    req.get("Authorization") || req.body.jwt || req.query.jwt;

  if (!tokenJWT) {
    return next(createHttpError(401, "Token JWT is required"));
  }

  if (tokenJWT.startsWith("Bearer ")) {
    tokenJWT = tokenJWT.slice(7).trim();
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    const payload = jwt.verify(tokenJWT, JWT_SECRET);

    let data: JwtPayload;
    if (typeof payload === "string") {
      try {
        data = JSON.parse(payload);
      } catch {
        return next(createHttpError(401, "Invalid token payload"));
      }
    } else if (
      typeof payload === "object" &&
      payload !== null &&
      "userId" in payload
    ) {
      data = payload as JwtPayload;
    } else {
      return next(createHttpError(401, "Invalid token payload"));
    }

    req.apiUserId = data.userId;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return next(createHttpError(401, "Invalid token JWT"));
  }
}
