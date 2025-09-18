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
const cardController_1 = require("../controllers/cardController");
const CardModel_1 = __importDefault(require("../models/CardModel"));
const CardService_1 = __importDefault(require("../services/CardService"));
const db_1 = __importDefault(require("../config/db"));
const jwtAuth = __importStar(require("../middlewares/jwtAuthMiddleware"));
const cardValidators_1 = require("../validators/cardValidators");
const cardSchema_1 = require("../validators/cardSchema");
const router = (0, express_1.Router)();
const model = new CardModel_1.default(db_1.default);
const service = new CardService_1.default(model);
const controller = new cardController_1.CardController(service);
router.get("/", jwtAuth.guard, controller.getAllCards);
router.get("/:id", jwtAuth.guard, controller.getCard);
router.post("/", jwtAuth.guard, (0, cardValidators_1.validateCard)(cardSchema_1.cardCreateSchema), controller.addCard);
router.put("/:id", jwtAuth.guard, (0, cardValidators_1.validateCard)(cardSchema_1.cardUpdateSchema), controller.updateCard);
router.delete("/:id", jwtAuth.guard, controller.deleteCard);
router.post("/addAssignee", jwtAuth.guard, controller.addAssignee);
router.delete("/removeAssignee", jwtAuth.guard, controller.removeAssignee);
exports.default = router;
