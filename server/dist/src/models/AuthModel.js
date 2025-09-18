"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthModel {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateCredentials({ email, password, }) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user)
            return null;
        if (!user.status)
            return null;
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid)
            return null;
        const { password: _, ...safeUser } = user;
        return safeUser;
    }
    async register({ name, email, password, photo, status = false, }) {
        let hashedPassword = "";
        if (password) {
            hashedPassword = await bcrypt_1.default.hash(password, 10);
        }
        return this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                photo,
                status,
            },
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                name: true,
                photo: true,
            },
        });
        return user;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                photo: true,
            },
        });
        return user;
    }
    async updateUser(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }
}
exports.default = AuthModel;
