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
const listController_1 = require("../controllers/listController");
const ListModel_1 = __importDefault(require("../models/ListModel"));
const ListService_1 = __importDefault(require("../services/ListService"));
const db_1 = __importDefault(require("../config/db"));
const jwtAuth = __importStar(require("../middlewares/jwtAuthMiddleware"));
const listValidators_1 = require("../validators/listValidators");
const listSchema_1 = require("../validators/listSchema");
const router = (0, express_1.Router)();
const model = new ListModel_1.default(db_1.default);
const service = new ListService_1.default(model);
const controller = new listController_1.ListController(service);
router.get("/", jwtAuth.guard, controller.getAllLists);
router.get("/:id", jwtAuth.guard, controller.getList);
router.post("/", jwtAuth.guard, (0, listValidators_1.validateList)(listSchema_1.listCreateSchema), controller.addList);
router.put("/:id", jwtAuth.guard, (0, listValidators_1.validateList)(listSchema_1.listUpdateSchema), controller.updateList);
router.delete("/:id", jwtAuth.guard, controller.deleteList);
exports.default = router;
