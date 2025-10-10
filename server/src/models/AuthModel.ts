import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { SafeUser } from "./BoardModel";
import { addMinutes } from "date-fns";
import { deletePhoto } from "../lib/uploadConfigure";

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

  async changePassword(userId: number, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return null;
    }
    const passwordHashed = await bcrypt.hash(password, 10);
    return await this.prisma.user.update({
      where: { id: userId },
      data: { password: passwordHashed },
    });
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

  async findById(id: number): Promise<{
    id: number;
    email: string;
    name: string;
    photo: string | null;
  } | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        photo: true,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<{
    id: number;
    name: string;
    photo: string | null;
    status: boolean;
  } | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        photo: true,
        status: true,
      },
    });

    return user;
  }

  async updateUser(
    userId: number,
    data: Partial<Pick<User, "status" | "password" | "name" | "photo">>,
  ) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { ...data, photo: null },
    });
  }

  async createToken(userId: number, token: string) {
    return this.prisma.passwordResetToken.create({
      data: {
        token,
        userId,
        expiresAt: addMinutes(new Date(), 15),
      },
    });
  }

  async isTokenCreated(token: string) {
    const tokenGenerated = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });
    return tokenGenerated;
  }

  async changeTokenToUsed(token: string) {
    const tokenUsed = await this.prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });
    return tokenUsed;
  }

  async hasTokenRecently(userId: number) {
    return await this.prisma.passwordResetToken.findFirst({
      where: {
        userId,
        expiresAt: { gte: new Date() },
        used: false,
      },
      orderBy: {
        expiresAt: "asc",
      },
    });
  }

  async deactivateUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error(
        "Usuario no encontrado o no tienes permiso para eliminar este usuario",
      );
    }

    await this.prisma.$transaction(async (tx) => {
      // Borrar relaciones del usuario
      await tx.cardAssignee.deleteMany({ where: { userId } });
      await tx.comment.deleteMany({ where: { userId } });
      await tx.boardMember.deleteMany({ where: { userId } });
      await tx.media.deleteMany({ where: { id: userId } });
      await tx.profile.deleteMany({ where: { userId } });

      if (user.photo) await deletePhoto("users", user.photo);

      // Borrar boards propios
      const boards = await tx.board.findMany({ where: { ownerId: userId } });
      for (const board of boards) {
        await Promise.all(
          boards
            .filter((b) => b.image)
            .map((b) => deletePhoto("boards", b.image!)),
        );
        await tx.cardAssignee.deleteMany({
          where: { card: { id: board.id } },
        });
        await tx.comment.deleteMany({ where: { card: { id: board.id } } });
        await tx.cardLabel.deleteMany({
          where: { card: { id: board.id } },
        });
        await tx.card.deleteMany({ where: { id: board.id } });
        await tx.label.deleteMany({ where: { boardId: board.id } });
        await tx.boardMember.deleteMany({ where: { boardId: board.id } });
      }
      await tx.board.deleteMany({ where: { ownerId: userId } });

      // Desactivar cuenta
      await tx.user.update({
        where: { id: userId },
        data: { photo: null, status: false },
      });
    });
    return {
      email: user.email,
      name: user.name,
    };
  }
}

export default AuthModel;
