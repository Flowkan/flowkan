import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res, next) => {
    try {
      const user = await this.authService.validateCredentials(req.body);

      if (!user) {
        next(createHttpError(401, "Invalid credentials"));
        return;
      }

      jwt.sign(
        { user_id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
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

  register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      let photoUrl = null;
      if (req.file) {
        photoUrl = `/uploads/${req.file.filename}`;
      }

      const newUser = await this.authService.register({
        name,
        email,
        password,
        photo: photoUrl,
      });
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
