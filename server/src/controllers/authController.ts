import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import AuthService from "../services/AuthService";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../middlewares/jwtAuthMiddleware";

export class AuthController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.validateCredentials(req.body);

      if (!user) {
        next(createHttpError(401, "Invalid credentials"));
        return;
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
          res.json({ accessToken: tokenJWT });
        },
      );
    } catch (err) {
      next(err as Error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newUser = await this.authService.register(req.body);
      const { password, ...safeUser } = newUser;
      res.status(201).json({ success: true, user: safeUser });
    } catch (err) {
      console.log("error", err);
      if (this.isPrismaUniqueConstraintError(err)) {
        res.status(400).json({
          success: false,
          message: "El email ya está registrado",
        });
        return;
      }
      next(createHttpError(500, "Error al registrar usuario"));
    }
  };
  // Prisma: Unique constraint failed
  private isPrismaUniqueConstraintError(err: unknown): boolean {
    return (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    );
  }
}
