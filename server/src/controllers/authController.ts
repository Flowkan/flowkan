import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import AuthService from "../services/AuthService";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../middlewares/jwtAuthMiddleware";
import { Prisma, User } from "@prisma/client";
import passport from "passport";
import "../config/passport";
import { sendEmailTask } from "../broker/producers/emailProducer";

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
        { userId: user.id } satisfies JwtPayload,
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
        photo: req.body.photo || null,
      };
      const userVerification = await this.authService.findByEmail(email);

      const language = this.getLanguage(req);

      if (userVerification && !userVerification.status) {
        const frontendUrl =
          process.env.FRONTEND_WEB_URL || "http://localhost:5173";
        // si usuario inactivo reactivar
        const reactivatedUser = await this.authService.activateUser(
          userVerification.id,
          { name, password, photo: req.body.photo || null },
        );

        if (!process.env.JWT_SECRET) {
          throw new Error("JWT_SECRET no definido");
        }

        // enviar correo de bienvenida otra vez
        await sendEmailTask({
          type: "WELCOME",
          to: reactivatedUser.email,
          data: {
            name: reactivatedUser.name,
            url: frontendUrl,
          },
          language,
        });

        res.status(200).json({
          success: true,
          user: reactivatedUser,
          message: "Usuario reactivado correctamente",
          reactivate: true,
        });
        return;
      }

      const newUser = await this.authService.register(userData);
      let photoUrl = null;
      if (req.body.photo) {
        photoUrl = `/uploads/${req.body.avatar}`;
        newUser.photo = photoUrl;
      }
      const { password: _omit, ...safeUser } = newUser;

      if (!process.env.JWT_SECRET) {
        throw new Error("No se puede registrar usuario. Contacte con flowkan");
      }
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const frontendUrl =
        process.env.FRONTEND_WEB_URL || "http://localhost:5173";

      await sendEmailTask({
        to: newUser.email,
        type: "CONFIRMATION",
        data: {
          name: newUser.name,
          url: frontendUrl,
          token,
        },
        language,
      });

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
  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.apiUserId;
      const user = await this.authService.findById(userId);
      if (user) {
        res.json({ result: user });
        return;
      }
      res.status(500).json({ error: "Usuario no loggeado" });
    } catch (error) {
      next(error);
    }
  };
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const user = await this.authService.findByEmail(email);
      if (user) {
        if (!process.env.JWT_SECRET || !process.env.FRONTEND_WEB_URL) {
          throw new Error(
            "No se puede cambiar su contraseña. Contacte con flowkan",
          );
        }

        const hasToken = await this.authService.hasTokenRecently(user.id);
        if (hasToken) {
          return next(
            createHttpError(
              409,
              "Revise su bandeja de email, tiene un token activo",
            ),
          );
        }

        const token = await new Promise<string>((resolve, reject) => {
          if (!process.env.JWT_SECRET) {
            throw new Error(
              "No se puede cambiar su contraseña. Contacte con flowkan",
            );
          }
          jwt.sign(
            { userId: user.id } satisfies JwtPayload,
            process.env.JWT_SECRET,
            {
              expiresIn: "15m",
            },
            (err, tokenJWT) => {
              if (err) {
                reject(err);
                // return next(err);
              }
              if (!tokenJWT) {
                return next(
                  createHttpError(
                    500,
                    "No se puede cambiar su contraseña. Contacte con flowkan",
                  ),
                );
              }
              resolve(tokenJWT);
            },
          );
        });
        const language = this.getLanguage(req);
        const frontendUrl =
          process.env.FRONTEND_WEB_URL || "http://localhost:5173";
        await sendEmailTask({
          to: email,
          type: "PASSWORD_RESET",
          data: {
            url: frontendUrl,
            token,
          },
          language,
        });

        await this.authService.generatedToken(user.id, token);

        res.json({
          message:
            "Se ha enviado un link a su correo para cambiar su cotraseña",
        });
      }
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.apiUserId;
      const tokenFromUser = req.tokenToChangePassword;
      const { password } = req.body;
      const change = await this.authService.changePassword(userId, password);
      if (!change || !tokenFromUser) {
        throw createHttpError(
          500,
          "No se pudo cambiar su contraseña, contactese con Flowkan",
        );
      }
      await this.authService.changeTokenToUsed(tokenFromUser);
      res.json({
        message:
          "Su contraseña ha sido cambiada, inicie sesión con su nueva contraseña",
      });
    } catch (error) {
      next(error);
    }
  };

  googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

  githubAuth = passport.authenticate("github", { scope: ["user:email"] });

  handleOAuthCallback = (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const user = req.user as User;

    if (!process.env.JWT_SECRET || !process.env.FRONTEND_WEB_URL) {
      return res
        .status(500)
        .json({ message: "Configuración del servidor incompleta" });
    }

    const accessToken = jwt.sign(
      { userId: user.id } satisfies JwtPayload,
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo || null,
    };

    const encodedUser = encodeURIComponent(JSON.stringify(safeUser));

    res.redirect(
      `${process.env.FRONTEND_WEB_URL}/login?token=${accessToken}&user=${encodedUser}`,
    );
  };

  deactivateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.apiUserId;
      if (!userId) {
        return res.status(401).json({ error: "No estas autorizado" });
      }
      const userData = await this.authService.deactivateUser(userId);

      res.clearCookie("auth", {
        httpOnly: true,
        path: "/",
      });

      const language = this.getLanguage(req);
      const frontendUrl =
        process.env.FRONTEND_WEB_URL || "http://localhost:5173";

      await sendEmailTask({
        to: userData.email,
        type: "GOODBYE",
        data: {
          name: userData.name,
          url: frontendUrl,
        },
        language,
      });

      res.json(userData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      next(error);
    }
  };

  getLanguage = (req: Request) => {
    const acceptLanguageHeader = req.headers["accept-language"];
    const primaryLanguageCode = acceptLanguageHeader
      ? acceptLanguageHeader.split(",")[0].toLowerCase()
      : "es";

    let language = primaryLanguageCode.split("-")[0];

    if (language !== "es" && language !== "en") {
      language = "es";
    }

    return language;
  };
}
