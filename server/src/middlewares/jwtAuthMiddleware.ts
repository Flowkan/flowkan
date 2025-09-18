import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService";
import AuthModel from "../models/AuthModel";
import prisma from "../config/db.js";


export interface JwtPayload {
  user_id: number;
}

export interface tokenPayload {
  token:string;
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

export async function verifyTokenEnabled(req: Request, res: Response, next: NextFunction) {
  try {
    let tokenJWT: string | undefined = req.get("Authorization") || req.body.jwt || req.query.jwt;
    tokenJWT = tokenJWT?.startsWith("Bearer ")
    ? tokenJWT.slice(7).trim()
    : tokenJWT;

    if (!tokenJWT) {
      return next(createHttpError(401, "Token JWT is required"));
    }
    const JWT_SECRET = process.env.JWT_SECRET    
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables")
    }

    const authModel = new AuthModel(prisma)
    const authService = new AuthService(authModel)

    const existToken = await authService.existToken(tokenJWT)

    if(!existToken || existToken.used || existToken.expiresAt < new Date()){
      return next(createHttpError(401, "Token inválido o expirado"));
    }

    jwt.verify(tokenJWT, JWT_SECRET, (err, payload: unknown) => {
      if (err) {
        return next(createHttpError(401, "Invalid token JWT"));
      }

      if (typeof payload !== "object" || payload === null || !("user_id" in payload)) {
        return next(createHttpError(401, "Invalid token payload"));
      }
      req.apiUserId = (payload as JwtPayload).user_id
      req.tokenToChangePassword = tokenJWT;
      next();
    });


  } catch (error) {
    next(error)
  }
}
