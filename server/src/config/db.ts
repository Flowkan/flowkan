import { PrismaClient } from "@prisma/client";

const pool = new PrismaClient();
export default pool;