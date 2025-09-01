import bcrypt from "bcrypt";

class AuthModel {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async validateCredentials({ email, password }) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async register({ name, email, password, photo }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        photo,
      },
    });
  }
}

export default AuthModel;
