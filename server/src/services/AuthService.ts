import { User } from "@prisma/client";
import AuthModel, { RegisterParams, ValidateCredentialsParams } from "../models/AuthModel";

class AuthService {
  private authModel: AuthModel;
  constructor(authModel: AuthModel) {
    this.authModel = authModel;
  }

  async validateCredentials(data: ValidateCredentialsParams): Promise <User | null> {
    if(!data.email || !data.password) {
      throw new Error("Email and password are required");
    }

    return this.authModel.validateCredentials(data);
  }

  async register(data: RegisterParams) {
    if (!data.name || !data.email || !data.password) {
      throw new Error("All fieldsets are required. (Name, email and password)")
    }
    return this.authModel.register(data);
  }
}

export default AuthService