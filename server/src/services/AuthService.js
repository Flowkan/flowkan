class AuthService {
  constructor(authModel) {
    this.authModel = authModel;
  }

  async validateCredentials(data) {
    return this.authModel.validateCredentials(data);
  }

  async register(data) {
    return this.authModel.register(data);
  }
}

export default AuthService;
