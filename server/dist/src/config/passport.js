"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const db_js_1 = __importDefault(require("./db.js"));
const AuthService_1 = __importDefault(require("../services/AuthService"));
const AuthModel_1 = __importDefault(require("../models/AuthModel"));
const authModel = new AuthModel_1.default(db_js_1.default);
const authService = new AuthService_1.default(authModel);
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/${process.env.API_VERSION}/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    console.log("DATOS PROFILE", profile.emails, profile.displayName);
    try {
        const email = profile.emails[0].value;
        let user = await authService.findByEmail(email);
        user ??= await authService.register({
            name: profile.displayName,
            email,
            photo: null,
            password: "googlepass",
            status: true,
        });
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
}));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/${process.env.API_VERSION}/auth/github/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || `${profile.username}@github.fake`;
        let user = await authService.findByEmail(email);
        user ??= await authService.register({
            name: profile.displayName || profile.username || "",
            email,
            photo: null,
            password: "githubpass",
            status: true,
        });
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
