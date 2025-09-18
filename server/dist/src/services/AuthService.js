"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthService {
    authModel;
    constructor(authModel) {
        this.authModel = authModel;
    }
    async validateCredentials(data) {
        if (!data.email || !data.password) {
            throw new Error("Email and password are required");
        }
        return this.authModel.validateCredentials(data);
    }
    async register(data) {
        if (!data.name || !data.email || !data.password) {
            throw new Error("All fieldsets are required. (Name, email and password)");
        }
        return this.authModel.register(data);
    }
    async findById(id) {
        return this.authModel.findById(id);
    }
    async findByEmail(email) {
        return this.authModel.findByEmail(email);
    }
    async activateUser(userId) {
        return this.authModel.updateUser(userId, { status: true });
    }
}
exports.default = AuthService;
