import { User } from "@prisma/client";
import AuthModel, {
  RegisterParams,
  ValidateCredentialsParams,
} from "../models/AuthModel";
import { SafeUser } from "../models/BoardModel";

class AuthService {
  private authModel: AuthModel;
  constructor(authModel: AuthModel) {
    this.authModel = authModel;
  }
  async changePassword(userId: number, password: string) {
    return this.authModel.changePassword(userId, password);
  }

  async validateCredentials(
    data: ValidateCredentialsParams,
  ): Promise<SafeUser | null> {
    if (!data.email || !data.password) {
      throw new Error("Email and password are required");
    }
    return this.authModel.validateCredentials(data);
  }

  async register(data: RegisterParams): Promise<User> {
    if (!data.name || !data.email || !data.password) {
      throw new Error("All fieldsets are required. (Name, email and password)");
    }
    return this.authModel.register(data);
  }

  async findById(id: number) {
    return this.authModel.findById(id);
  }

  async findByEmail(email: string) {
    return this.authModel.findByEmail(email);
  }

  async activateUser(userId: number) {
    return this.authModel.updateUser(userId, { status: true });
  }
  async generatedToken(userId: number, token: string) {
    return this.authModel.createToken(userId, token);
  }
  async existToken(token: string) {
    return this.authModel.isTokenCreated(token);
  }
  async changeTokenToUsed(token: string) {
    return this.authModel.changeTokenToUsed(token);
  }

  async hasTokenRecently(userId: number) {
    return this.authModel.hasTokenRecently(userId);
  }

  async deactivateUser(userId: number) {
    const userData = await this.authModel.deactivateUser(userId);
    return userData;
  }
}

export default AuthService;
