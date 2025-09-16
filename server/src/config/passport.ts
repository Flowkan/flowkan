import passport from "passport";
import dotenv from "dotenv";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import prisma from "./db.js";
import AuthService from "../services/AuthService";
import AuthModel from "../models/AuthModel";

const authModel = new AuthModel(prisma);
const authService = new AuthService(authModel);

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/${process.env.API_VERSION}/auth/google/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done,
    ) => {
      console.log("DATOS PROFILE", profile.emails, profile.displayName);
      try {
        const email = profile.emails![0].value;
        let user = await authService.findByEmail(email);

        user ??= await authService.register({
          name: profile.displayName,
          email,
          photo: null,
          password: "googlepass",
          status: true,
        });

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/${process.env.API_VERSION}/auth/github/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: (
        arg0: unknown,
        arg1: { name: string; photo: string | null } | null,
      ) => void,
    ) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github.fake`;
        let user = await authService.findByEmail(email);

        user ??= await authService.register({
          name: profile.displayName || profile.username || "",
          email,
          photo: null,
          password: "githubpass",
          status: true,
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);
