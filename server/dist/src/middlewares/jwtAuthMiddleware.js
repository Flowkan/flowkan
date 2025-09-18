"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guard = guard;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
function guard(req, res, next) {
    let tokenJWT = req.get("Authorization") || req.body.jwt || req.query.jwt;
    if (!tokenJWT) {
        return next((0, http_errors_1.default)(401, "Token JWT is required"));
    }
    if (tokenJWT.startsWith("Bearer ")) {
        tokenJWT = tokenJWT.slice(7).trim();
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    try {
        const payload = jsonwebtoken_1.default.verify(tokenJWT, JWT_SECRET);
        let data;
        if (typeof payload === "string") {
            try {
                data = JSON.parse(payload);
            }
            catch {
                return next((0, http_errors_1.default)(401, "Invalid token payload"));
            }
        }
        else if (typeof payload === "object" &&
            payload !== null &&
            "userId" in payload) {
            data = payload;
        }
        else {
            return next((0, http_errors_1.default)(401, "Invalid token payload"));
        }
        req.apiUserId = data.userId;
        next();
    }
    catch (err) {
        console.error("JWT verification error:", err);
        return next((0, http_errors_1.default)(401, "Invalid token JWT"));
    }
}
