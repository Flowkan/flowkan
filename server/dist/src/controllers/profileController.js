"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
// uso temporal
const db_1 = __importDefault(require("../config/db"));
class ProfileController {
    profileService = {};
    prismaClient = db_1.default;
    constructor(profileService = {}) {
        this.profileService = profileService;
    }
    partial = async (req, res, next) => {
        try {
            const userId = req.apiUserId;
            const user = await this.prismaClient.user.findUnique({
                where: { id: userId },
            });
            // console.log(user);
            if (user) {
                const body = req.body;
                const data = {};
                const profile = {
                // username:null,
                // dateBirth:null,
                // location:null,
                // allowNotifications:true,
                // bio:null
                };
                if (body.name)
                    data.name = body.name;
                if (req.file?.filename)
                    data.photo = req.file.filename;
                if (body.username)
                    profile.username = body.username;
                if (body.dateBirth)
                    profile.dateBirth = new Date(body.dateBirth);
                if (body.location)
                    profile.location = body.location;
                if (body.allowNotifications)
                    profile.allowNotifications =
                        body.allowNotifications === "false" ? false : true;
                if (body.bio)
                    profile.bio = body.bio;
                // console.log(profile);
                const partialUpdate = await this.prismaClient.user.update({
                    where: { id: userId },
                    data,
                });
                const profileToCreate = await this.prismaClient.profile.findUnique({
                    where: { userId },
                });
                let newProfile;
                if (profileToCreate) {
                    newProfile = await this.prismaClient.profile.update({
                        where: { userId },
                        data: profile,
                    });
                }
                else {
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
        }
        catch (error) {
            next(error);
            // res.status(500).send("Error en la api");
        }
    };
    getOne = async (req, res, next) => {
        try {
            const userId = req.apiUserId;
            const profile = await this.prismaClient.profile.findUnique({
                where: { userId },
            });
            if (profile) {
                const { id, userId, ...profileSafe } = profile;
                res.json({ error: null, profile: { ...profileSafe } });
                return;
            }
            res.json({ error: "Profile vacío", profile: null });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ProfileController = ProfileController;
