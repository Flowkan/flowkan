"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListController = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
class ListController {
    listService;
    constructor(listService) {
        this.listService = listService;
    }
    getAllLists = async (req, res) => {
        try {
            const userId = req.apiUserId;
            const boardId = Number(req.body.boardId);
            const lists = await this.listService.getAllLists(userId, boardId);
            res.json(lists);
        }
        catch (err) {
            console.log("asdfasd", err);
            res.status(500).send("Error al obtener las listas");
        }
    };
    getList = async (req, res) => {
        try {
            const userId = req.apiUserId;
            const listId = Number(req.params.id);
            const list = await this.listService.getListById(userId, listId);
            if (!list)
                return res.status(404).send("Lista no encontrada");
            res.json(list);
        }
        catch (err) {
            res.status(500).send("Error al obtener la lista");
        }
    };
    addList = async (req, res) => {
        try {
            const { title, boardId, position } = req.body;
            const list = await this.listService.createList({
                title,
                boardId,
                position,
            });
            res.status(201).json(list);
        }
        catch (err) {
            res.status(500).send("Error al crear la lista");
        }
    };
    updateList = async (req, res, next) => {
        try {
            const userId = req.apiUserId;
            const listId = Number(req.params.id);
            const data = req.body;
            const list = await this.listService.updateList(userId, listId, data);
            res.json(list);
        }
        catch (err) {
            if (err instanceof Error && err.message.includes("permiso")) {
                return next((0, http_errors_1.default)(403, err.message || "Error al actualizar la lista"));
            }
            next(err);
        }
    };
    deleteList = async (req, res, next) => {
        try {
            const userId = req.apiUserId;
            const listId = Number(req.params.id);
            await this.listService.deleteList(userId, listId);
            res.status(204).send();
        }
        catch (err) {
            if (err instanceof Error && err.message.includes("permiso")) {
                return next((0, http_errors_1.default)(403, err.message || "Error al eliminar la lista"));
            }
            next(err);
        }
    };
}
exports.ListController = ListController;
