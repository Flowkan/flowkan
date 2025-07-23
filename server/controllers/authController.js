import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res) => {
    try {
      const user = await this.authService.validateCredentials(req.body);

      if (!user) {
        next(createHttpError(401, "Invalid credentials"));
        return;
      }

      jwt.sign(
        { user_id: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
        (err, tokenJWT) => {
          if (err) {
            return next(err);
          }
          res.json({ tokenJWT });
        },
      );
    } catch (err) {
      next(err);
    }
  };

  register = async (req, res) => {
    try {
      const newUser = await this.authService.register(req.body);
      res.status(201).json({ success: true, user: newUser });
    } catch (err) {
      console.log("error", err);
      // Prisma: Unique constraint failed
      if (err.code === "P2002") {
        res.status(400).json({
          success: false,
          message: "No se pudo completar el registro",
        });
      }

      res
        .status(500)
        .json({ success: false, message: "Error al registrar usuario" });
    }
  };
}
