"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
class CardController {
    cardService;
    constructor(cardService) {
        this.cardService = cardService;
    }
    getAllCards = async (req, res) => {
        try {
            const userId = req.apiUserId;
            const listId = Number(req.body.listId);
            const cards = await this.cardService.getAllCards(userId, listId);
            res.json(cards);
        }
        catch (err) {
            res.status(500).send("Error al obtener las tarjetas");
        }
    };
    getCard = async (req, res) => {
        try {
            const userId = req.apiUserId;
            const cardId = Number(req.params.id);
            const card = await this.cardService.getCardById(userId, cardId);
            if (!card)
                return res.status(404).send("Tarjeta no encontrada");
            res.json(card);
        }
        catch (err) {
            res.status(500).send("Error al obtener la tarjeta");
        }
    };
    addCard = async (req, res, next) => {
        try {
            const { title, description, position, listId } = req.body;
            const card = await this.cardService.createCard({
                title,
                description,
                position,
                listId,
            });
            res.status(201).json(card);
        }
        catch (err) {
            if (err instanceof Error) {
                return next((0, http_errors_1.default)(500, err.message || "Error al crear la tarjeta"));
            }
            return next((0, http_errors_1.default)(500, "Error desconocido al crear la tarjeta"));
        }
    };
    updateCard = async (req, res, next) => {
        try {
            const userId = req.apiUserId;
            const cardId = Number(req.params.id);
            const data = req.body;
            const card = await this.cardService.updateCard(userId, cardId, data);
            res.json(card);
        }
        catch (err) {
            if (err instanceof Error && err.message.includes("permiso")) {
                return next((0, http_errors_1.default)(403, err.message || "Error al actualizar la tarjeta"));
            }
            next(err);
        }
    };
    deleteCard = async (req, res, next) => {
        try {
            const userId = req.apiUserId;
            const cardId = Number(req.params.id);
            await this.cardService.deleteCard(userId, cardId);
            res.status(204).send();
        }
        catch (err) {
            if (err instanceof Error && err.message.includes("permiso")) {
                return next((0, http_errors_1.default)(403, err.message ? err.message : "Error al eliminar la lista"));
            }
            next(err);
        }
    };
    addAssignee = async (req, res, next) => {
        try {
            const userId = req.apiUserId;
            const { cardId, assigneeId } = req.body;
            const user = await this.cardService.addAssignee(userId, cardId, assigneeId);
            res.status(201).json(user);
        }
        catch (err) {
            next((0, http_errors_1.default)(500, err.message || "Error al asignar usuario a la tarjeta"));
        }
    };
    removeAssignee = async (req, res, next) => {
        try {
            const userId = req.apiUserId;
            const { cardId, assigneeId } = req.body;
            await this.cardService.removeAssignee(userId, cardId, assigneeId);
            res.status(204).send();
        }
        catch (err) {
            next((0, http_errors_1.default)(500, err.message || "Error al eliminar asignación"));
        }
    };
}
exports.CardController = CardController;
