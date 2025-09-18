"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pickDefaultImage_1 = __importDefault(require("../lib/pickDefaultImage"));
class BoardController {
    boardService;
    authService;
    constructor(boardService, authService) {
        this.boardService = boardService;
        this.authService = authService;
    }
    getAll = async (req, res) => {
        try {
            const userId = req.apiUserId;
            const limit = Math.max(parseInt(req.query.limit) || 10, 1);
            const page = Math.max(parseInt(req.query.page) || 1, 1);
            const skip = (page - 1) * limit < 0 ? 0 : (page - 1) * limit;
            const withCount = req.query.withCount === "true";
            if (withCount) {
                const [boards, totalCount] = await Promise.all([
                    this.boardService.getAllBoardsByUserId(userId, limit, skip),
                    this.boardService.getBoardCountByUserId(userId),
                ]);
                return res.json({
                    boards,
                    totalCount,
                    page,
                    limit,
                });
            }
            const boards = await this.boardService.getAllBoardsByUserId(userId, limit, skip);
            res.json(boards);
        }
        catch (err) {
            res.status(500).send("Error al obtener los tableros");
        }
    };
    get = async (req, res) => {
        try {
            const userId = req.apiUserId;
            const boardId = req.params.id;
            const board = await this.boardService.get({ userId, boardId });
            res.json(board);
        }
        catch (err) {
            res.status(500).send("Error al obtener el tablero");
        }
    };
    getBoardByTitle = async (req, res) => {
        try {
            const userId = req.apiUserId;
            const boardTitle = String(req.query.title) || "";
            const boards = await this.boardService.getBoardByTitle(userId, boardTitle);
            res.json(boards);
        }
        catch (error) {
            res.status(404).send("No existen tableros con este nombre");
        }
    };
    getBoardByMember = async (req, res) => {
        try {
            const userId = req.apiUserId;
            const boardMember = String(req.query.member) || "";
            const boards = await this.boardService.getBoardByMember(userId, boardMember);
            res.json(boards);
        }
        catch (error) {
            res.status(404).send("No hay tableros con este miembro");
        }
    };
    add = async (req, res) => {
        try {
            const userId = req.apiUserId;
            const { title } = req.body;
            const image = req.body.image
                ? `/uploads/boards/${req.body.image}_o.webp`
                : (0, pickDefaultImage_1.default)();
            const board = await this.boardService.add({ userId, title, image });
            res.status(201).json(board);
        }
        catch (err) {
            res.status(500).send("Error al crear tablero :(");
        }
    };
    update = async (req, res) => {
        try {
            const userId = req.apiUserId;
            const boardId = req.params.id;
            const { title } = req.body;
            const data = { title };
            const board = await this.boardService.update({ userId, boardId, data });
            res.status(200).json(board);
        }
        catch (err) {
            res.status(500).send("Error al actualizar el tablero");
        }
    };
    delete = async (req, res) => {
        try {
            const userId = req.apiUserId;
            const boardId = req.params.id;
            await this.boardService.delete({ userId, boardId });
            res.status(204).json({});
        }
        catch (err) {
            console.log("errsaddsfdsdsafor", err);
            res.status(500).send("Error al eliminar el tablero");
        }
    };
    shareBoard = async (req, res) => {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        try {
            const userId = req.apiUserId;
            const boardId = req.params.id;
            const board = await this.boardService.get({ userId, boardId });
            const inviter = await this.authService.findById(userId);
            const payload = {
                boardId: boardId,
                inviterId: userId,
                type: "board-invitation",
            };
            const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "24h" });
            res.status(201).json({
                token,
                inviterName: inviter?.name,
                boardTitle: board?.title,
                inviterPhoto: inviter?.photo,
                boardId,
            });
        }
        catch (err) {
            console.error("Error generating invitation link:", err);
            res.status(500).send("Error al generar el enlace de invitación");
        }
    };
    acceptInvitation = async (req, res) => {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET no está en las variables de entorno");
        }
        try {
            const { token } = req.body;
            const userId = req.apiUserId;
            const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const { boardId } = payload;
            await this.boardService.acceptInvitation({
                boardId: Number(boardId),
                userId,
            });
            res.status(200).send(`¡Invitación aceptada para el tablero ${boardId}!`);
        }
        catch (err) {
            console.error(err);
            if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return res.status(401).send("Enlace de invitación inválido o expirado");
            }
            res.status(500).send("Error al aceptar la invitación");
        }
    };
    boardUsers = async (req, res) => {
        try {
            const userId = req.apiUserId;
            const boardId = req.params.id;
            const board = await this.boardService.getBoardUsers({ userId, boardId });
            res.json(board);
        }
        catch (err) {
            console.log("error", err);
            res.status(500).send("Error al obtener usuarios del tablero");
        }
    };
}
exports.BoardController = BoardController;
