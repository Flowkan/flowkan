import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// uso temporal
import prisma from "../config/db.js";

interface RequestBody {
    name?:string;
    username?:string;
    dateBirth?:string;
    location?:string;
    allowNotifications?:string;
    bio?:string;
}

interface UserType {
    name?:string;
    photo?:string;
}
interface ProfileType { 
    id:number;
    userId:number;   
    username:string|null;
    dateBirth:Date|null;
    location:string|null;
    allowNotifications:boolean|null;
    bio:string|null;
}
interface ProfileCleanType {      
    username:string|null;
    dateBirth:Date|null;
    location:string|null;
    allowNotifications:boolean|null;
    bio:string|null;
}

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
            // console.log(user);
            if(user){
                const body = req.body as RequestBody
                const data:UserType = {}
                const profile:Partial<ProfileCleanType>={
                    // username:null,
                    // dateBirth:null,
                    // location:null,
                    // allowNotifications:true,
                    // bio:null
                }
                if(body.name) data.name = body.name
                if(req.file?.filename) data.photo = req.file.filename
                if(body.username) profile.username = body.username
                if(body.dateBirth) profile.dateBirth = new Date(body.dateBirth) 
                if(body.location) profile.location = body.location
                if(body.allowNotifications) profile.allowNotifications = body.allowNotifications === "false" ? false : true
                if(body.bio) profile.bio = body.bio
                // console.log(profile);
                const partialUpdate = await this.prismaClient.user.update({                
                    where:{id:userId},
                    data
                })
                const profileToCreate = await this.prismaClient.profile.findUnique({
                    where:{userId}
                })        
                let newProfile:ProfileType;        
                if(profileToCreate){
                    newProfile = await this.prismaClient.profile.update({
                        where:{userId},
                        data:profile
                    })                    
                }else{
                    newProfile = await this.prismaClient.profile.create({
                        data:{
                            ...profile,
                            user:{
                                connect:{id:userId}
                            }
                        }
                    })
                }
                const { password:_,...userSafe } = partialUpdate
                const { id:__,userId:___,...restProfile } = newProfile
                
                
                res.json({user:{...userSafe},profile:{...restProfile}});
                return
            }
            res.status(500).json({error:'Usuario no encontrado'})

        } catch (error) {
            next(error)
            // res.status(500).send("Error en la api");
        }
    }
    getOne = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const userId = req.apiUserId
            const profile = await this.prismaClient.profile.findUnique({
                where:{userId}
            })
            if(profile){
                const { id,userId,...profileSafe } = profile
                res.json({error:null,profile:{...profileSafe}})
                return
            }
            res.json({error:'Profile vacío',profile:null})
        } catch (error) {
            next(error)
        }
    }
}