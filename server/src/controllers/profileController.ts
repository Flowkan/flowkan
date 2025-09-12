import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// uso temporal
import prisma from "../config/db.js";

export class ProfileController {
    private profileService = {};
    private prismaClient:PrismaClient = prisma;
    constructor(profileService={}){
        this.profileService = profileService;
    }
    partial = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const userId = req.apiUserId;
            const user = await this.prismaClient.user.findUnique({
                where:{id:userId}
            })
            console.log(user);
            if(user){
                const photo = req.file?.filename
            }
            res.json({ok:'si se pudo'});
        } catch (error) {
            next(error)
            // res.status(500).send("Error en la api");
        }
    }
}