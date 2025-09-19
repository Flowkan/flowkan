import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// uso temporal
import prisma from "../config/db.js";
import { keyof } from "zod";

interface RequestBody {
  name?: string;
  username?: string;
  dateBirth?: string;
  location?: string;
  photo?: string;
  allowNotifications?: string;
  bio?: string;
}

interface UserType {
  name?: string;
  photo?: string;
}
interface ProfileType {
  id: number;
  userId: number;
  username: string | null;
  dateBirth: Date | null;
  location: string | null;
  allowNotifications: boolean | null;
  bio: string | null;
}
interface ProfileCleanType {
  username: string | null;
  dateBirth: Date | null;
  location: string | null;
  allowNotifications: boolean | null;
  bio: string | null;
}

export class ProfileController {
  private profileService = {};
  private prismaClient: PrismaClient = prisma;
  constructor(profileService = {}) {
    this.profileService = profileService;
  }

  partial = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.apiUserId;
      const user = await this.prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        const body = req.body as RequestBody;
        const data: UserType = {};
        const profile: Partial<ProfileCleanType> = {};
        if (body.name) data.name = body.name;
        if (body.photo) data.photo = req.body.photo;
        if (body.username) profile.username = body.username;
        if (body.dateBirth) profile.dateBirth = new Date(body.dateBirth);
        if (body.location) profile.location = body.location;
        if (body.allowNotifications)
          profile.allowNotifications = body.allowNotifications !== "true";
        if (body.bio) profile.bio = body.bio;

        const partialUpdate = await this.prismaClient.user.update({
          where: { id: userId },
          data,
        });
        const profileToCreate = await this.prismaClient.profile.findUnique({
          where: { userId },
        });
        let newProfile: ProfileType;
        if (profileToCreate) {
          newProfile = await this.prismaClient.profile.update({
            where: { userId },
            data: profile,
          });
        } else {
          newProfile = await this.prismaClient.profile.create({
            data: {
              ...profile,
              user: {
                connect: { id: userId },
              },
            },
          });
        }

        const { password: _, ...userSafe } = partialUpdate;
        const { id: __, userId: ___, ...restProfile } = newProfile;

        res.json({ user: { ...userSafe }, profile: { ...restProfile } });
        return;
      }
      res.status(500).json({ error: "Usuario no encontrado" });
    } catch (error) {
      next(error);
      // res.status(500).send("Error en la api");
    }
  };
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.apiUserId;
      const profile = await this.prismaClient.profile.findUnique({
        where: { userId },
      });
      if (profile) {
        const { id, userId, ...profileSafe } = profile;
        const profileClean = Object.entries({ ...profileSafe }).map(
          ([key, value]) => {
            if (value === null) {
              return [key, ""];
            }
            return [key, value];
          },
        );
        res.json({ error: null, profile: Object.fromEntries(profileClean) });
        return;
      }
      res.json({ error: "Profile vacío", profile: null });
    } catch (error) {
      next(error);
    }
  };
}
