"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importStar(require("http-errors"));
const cors_1 = __importDefault(require("cors"));
const boards_routes_1 = __importDefault(require("./routes/boards.routes"));
const list_routes_1 = __importDefault(require("./routes/list.routes"));
const card_routes_1 = __importDefault(require("./routes/card.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const morgan_1 = __importDefault(require("morgan"));
const node_path_1 = __importDefault(require("node:path"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const validationError_1 = require("./validators/validationError");
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(node_path_1.default.join(process.cwd(), "public", "uploads")));
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/boards", boards_routes_1.default);
app.use("/api/v1/lists", list_routes_1.default);
app.use("/api/v1/cards", card_routes_1.default);
//Profile...
app.use("/api/v1/profile", profile_routes_1.default);
app.use((req, res, next) => {
    if (!req.url.startsWith("/api")) {
        return res.status(404).send("Ruta no válida");
    }
    next((0, http_errors_1.default)(404));
});
app.use((err, req, res, next) => {
    let status;
    let responseData;
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof validationError_1.ValidationError) {
        status = err.status;
        const validationDetails = err.errors
            .map((e) => `${e.location} "${e.field}" ${e.msg}`)
            .join(", ");
        const errorMessage = `Error de validación: ${validationDetails}`;
        responseData = { error: errorMessage, details: err.errors };
    }
    else if (err instanceof http_errors_1.HttpError) {
        status = err.status;
        responseData = { error: err.message };
    }
    else {
        status = 500;
        responseData = { error: err.message || "Error interno del servidor" };
    }
    res.status(status);
    if (req.url.startsWith("/api")) {
        return res.json(responseData);
    }
    res.locals.message = responseData.error;
    res.render("Error en el servidor");
});
exports.default = app;
