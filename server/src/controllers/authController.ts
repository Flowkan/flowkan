import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import AuthService from "../services/AuthService";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../middlewares/jwtAuthMiddleware";
import { Prisma } from "@prisma/client";

type UniqueConstraintError = Prisma.PrismaClientKnownRequestError & {
  code: "P2002";
  meta: {
    target: string[];
  };
};

export class AuthController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.validateCredentials(req.body);

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

      jwt.sign(
        { user_id: user.id } satisfies JwtPayload,
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
        (err, tokenJWT) => {
          if (err) {
            return next(err);
          }
          res.json({
            accessToken: tokenJWT,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              photo: user.photo || null,
            },
          });
        },
      );
    } catch (err) {
      next(err);
    }
  };

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const newUser = await this.authService.register(req.body);
      let photoUrl = null;
      if (req.file) {
        photoUrl = `/uploads/${req.file.filename}`;
      }
      const { password, ...safeUser } = newUser;
      res.status(201).json({ success: true, user: { ...safeUser, photo: photoUrl } });
    } catch (err: unknown) {
      if (this.isPrismaUniqueConstraintError(err)) {
        return next(createHttpError(400, "El email ya está registrado"));
      }
      next(createHttpError(500, "Error al registrar usuario"));
    }
  };
  // Prisma: Unique constraint failed
  private isPrismaUniqueConstraintError(
    err: unknown,
  ): err is UniqueConstraintError {
    if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
      return false;
    }

    return (
      err.code === "P2002" &&
      Array.isArray(err.meta?.target) &&
      err.meta.target.every((t) => typeof t === "string")
    );
  }
}
