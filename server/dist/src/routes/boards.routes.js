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
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const BoardModel_1 = __importDefault(require("../models/BoardModel"));
const BoardService_1 = __importDefault(require("../services/BoardService"));
const boardController_1 = require("../controllers/boardController");
const jwtAuth = __importStar(require("../middlewares/jwtAuthMiddleware"));
const AuthService_1 = __importDefault(require("../services/AuthService"));
const AuthModel_1 = __importDefault(require("../models/AuthModel"));
const uploadConfigure_1 = require("../lib/uploadConfigure");
const router = (0, express_1.Router)();
// Inyección de dependencias
const model = new BoardModel_1.default(db_1.default);
const service = new BoardService_1.default(model);
const authModel = new AuthModel_1.default(db_1.default);
const authService = new AuthService_1.default(authModel);
const controller = new boardController_1.BoardController(service, authService);
router.get("/", jwtAuth.guard, controller.getAll);
router.get("/:id", jwtAuth.guard, controller.get);
router.post("/", jwtAuth.guard, uploadConfigure_1.upload.single("image"), controller.add);
router.put("/:id", jwtAuth.guard, controller.update);
router.delete("/:id", jwtAuth.guard, controller.delete);
router.get("/:id/share", jwtAuth.guard, controller.shareBoard);
router.post("/:id/invite", jwtAuth.guard, controller.acceptInvitation);
router.get("/:id/users", jwtAuth.guard, controller.boardUsers);
exports.default = router;
