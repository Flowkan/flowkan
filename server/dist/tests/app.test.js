"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe("app basic tests", () => {
    test("should return 404 for unknown routes", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/v1/unknown-route");
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });
    test("should return 404 for non-API routes", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/non-an-api-route");
        expect(res.status).toBe(404);
        expect(res.text).toBe("Ruta no válida");
    });
});
