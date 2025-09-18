"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const passport_1 = __importDefault(require("passport"));
const emailService_1 = require("../lib/emailService");
require("../config/passport");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login = async (req, res, next) => {
        try {
            const user = await this.authService.validateCredentials(req.body);
            if (!user) {
                throw (0, http_errors_1.default)(403, "Cuenta no verificada o datos incorrectos.");
            }
            if (!process.env.JWT_SECRET) {
                throw new Error("No se puede autenticar el usuario. Contacte con flowkan");
            }
            jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            }, (err, tokenJWT) => {
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
            });
        }
        catch (err) {
            next(err);
        }
    };
    register = async (req, res, next) => {
        try {
            const { name, email, password } = req.body;
            const userData = {
                name,
                email,
                password,
                photo: req.body.photo || null,
            };
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
            const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
            await (0, emailService_1.sendEmail)(newUser.email, "Confirma tu cuenta", `<h1>Bienvenido ${newUser.name}!</h1>
              <p>Haz click <a href="${process.env.FRONTEND_WEB_URL}/confirm?token=${token}">aquí</a> para confirmar tu cuenta.</p>`);
            res.status(201).json({ success: true, user: safeUser });
        }
        catch (err) {
            if (this.isPrismaUniqueConstraintError(err)) {
                res.status(400).json({
                    success: false,
                    message: "Registro fallido. Revisa los datos e inténtalo otra vez.",
                });
                return;
            }
            next((0, http_errors_1.default)(500, "Error al registrar usuario"));
        }
    };
    confirmEmail = async (req, res, next) => {
        try {
            const { token } = req.body;
            if (!token)
                throw (0, http_errors_1.default)(400, "Token no proporcionado");
            if (!process.env.JWT_SECRET)
                throw new Error("JWT_SECRET no definido");
            let payload;
            try {
                payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            }
            catch (err) {
                throw (0, http_errors_1.default)(400, "Token inválido o expirado");
            }
            await this.authService.activateUser(payload.userId);
            res.status(200).json({ message: "Cuenta confirmada correctamente" });
        }
        catch (err) {
            next(err);
        }
    };
    // Prisma: Unique constraint failed
    isPrismaUniqueConstraintError(err) {
        if (!(err instanceof client_1.Prisma.PrismaClientKnownRequestError)) {
            return false;
        }
        return (err.code === "P2002" &&
            Array.isArray(err.meta?.target) &&
            err.meta.target.every((t) => typeof t === "string"));
    }
    me = async (req, res, next) => {
        try {
            const userId = req.apiUserId;
            const user = await this.authService.findById(userId);
            if (user) {
                res.json({ result: user });
                return;
            }
            res.status(500).json({ error: "Usuario no loggeado" });
        }
        catch (error) {
            next(error);
        }
    };
    googleAuth = passport_1.default.authenticate("google", { scope: ["profile", "email"] });
    githubAuth = passport_1.default.authenticate("github", { scope: ["user:email"] });
    handleOAuthCallback = (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        const userId = req.user.id;
        if (!process.env.JWT_SECRET || !process.env.FRONTEND_WEB_URL) {
            return res
                .status(500)
                .json({ message: "Configuración del servidor incompleta" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: userId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.redirect(`${process.env.FRONTEND_WEB_URL}/login?token=${token}`);
    };
}
exports.AuthController = AuthController;
