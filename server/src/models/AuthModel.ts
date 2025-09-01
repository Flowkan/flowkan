import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

export interface ValidateCredentialsParams {
  email: string;
  password: string;
}

export interface RegisterParams extends ValidateCredentialsParams {
  name: string;
}

export type SafeUser = Omit<User, "password">;

class AuthModel {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async validateCredentials({
    email,
    password,
  }: ValidateCredentialsParams): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) return null;

    const { password: _, ...safeUser } = user;

    return safeUser as SafeUser;
  }

  async register({ name, email, password }: RegisterParams): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}

export default AuthModel;
