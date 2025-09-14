import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import AuthService from "../services/AuthService";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../middlewares/jwtAuthMiddleware";
import { Prisma } from "@prisma/client";
import { success } from "zod";
import { sendEmail } from "../lib/emailService";

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

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.authService.validateCredentials(req.body);

      if (!user) {
        throw createHttpError(403, "Cuenta no verificada o datos incorrectos.");
      }
      if (!process.env.JWT_SECRET) {
        throw new Error(
          "No se puede autenticar el usuario. Contacte con flowkan",
        );
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
      const { name, email, password } = req.body;
      const userData = {
        name,
        email,
        password,
        photo: req.file ? req.file.filename : null,
      };
      const newUser = await this.authService.register(userData);
      let photoUrl = null;
      if (req.file) {
        photoUrl = `/uploads/${req.file.filename}`;
        newUser.photo = photoUrl;
      }
      const { password: _omit, ...safeUser } = newUser;

      if (!process.env.JWT_SECRET) {
        throw new Error("No se puede registrar usuario. Contacte con flowkan");
      }
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      await sendEmail(
        newUser.email,
        "Confirma tu cuenta",
        `<h1>Bienvenido ${newUser.name}!</h1>
              <p>Haz click <a href="${process.env.FRONTEND_URL}/confirm?token=${token}">aquí</a> para confirmar tu cuenta.</p>`,
      );

      res.status(201).json({ success: true, user: safeUser });
    } catch (err: unknown) {
      if (this.isPrismaUniqueConstraintError(err)) {
        res.status(400).json({
          success: false,
          message: "Registro fallido. Revisa los datos e inténtalo otra vez.",
        });
        return;
      }
      next(createHttpError(500, "Error al registrar usuario"));
    }
  };

  confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      if (!token) throw createHttpError(400, "Token no proporcionado");
      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no definido");

      let payload: { userId: number };
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET) as {
          userId: number;
        };
      } catch (err) {
        throw createHttpError(400, "Token inválido o expirado");
      }

      await this.authService.activateUser(payload.userId);

      res.status(200).json({ message: "Cuenta confirmada correctamente" });
    } catch (err) {
      next(err);
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
