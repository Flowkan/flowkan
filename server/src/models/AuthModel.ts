import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { SafeUser } from "./BoardModel";
import { addMinutes } from 'date-fns'

export interface ValidateCredentialsParams {
  email: string;
  password: string;
  status?: boolean;
}

export interface RegisterParams extends ValidateCredentialsParams {
  name: string;
  photo?: string | null;
}

class AuthModel {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async changePassword(userId:number,password:string){
    const user = await this.prisma.user.findUnique({
      where:{id:userId}
    })
    if(!user){
      return null;
    }
    const passwordHashed = await bcrypt.hash(password, 10);
    return await this.prisma.user.update({
      where:{id:userId},
      data:{password:passwordHashed}
    })
  }

  async validateCredentials({
    email,
    password,
  }: ValidateCredentialsParams): Promise<SafeUser | null> {

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    
    if (!user) return null;

    if (!user.status) return null;    
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) return null;

    const { password: _, ...safeUser } = user;

    return safeUser as SafeUser;
  }

  async register({
    name,
    email,
    password,
    photo,
    status = false,
  }: RegisterParams): Promise<User> {
    let hashedPassword: string = "";
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
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

  async findById(
    id: number,
  ): Promise<{ name: string; photo: string | null } | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        photo: true,
      },
    });

    return user;
  }

  async findByEmail(
    email: string,
  ): Promise<{ id:number;name: string; photo: string | null } | null> {
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

  async updateUser(userId: number, data: { status: boolean }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }


  async createToken(userId:number,token:string){
    return this.prisma.passwordResetToken.create({
      data:{
        token,
        userId,
        expiresAt:addMinutes(new Date(),15)
      }
    })
  }

  async isTokenCreated(token:string){
    const tokenGenerated = await this.prisma.passwordResetToken.findUnique({
      where:{token}
    })
    return tokenGenerated
  }

  async changeTokenToUsed(token:string){
    const tokenUsed = await this.prisma.passwordResetToken.update({
      where:{token},
      data:{used:true}
    })
    return tokenUsed
  }

  async hasTokenRecently(userId:number){
    return await this.prisma.passwordResetToken.findFirst({
      where:{
        userId,
        expiresAt:{gte:new Date()},
        used:false        
      },
      orderBy:{
        expiresAt:'asc'
      }
    })
  }

}

export default AuthModel;
