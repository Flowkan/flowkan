import pool from '../config/db.js';

class BoardModel {

     constructor(prisma) {
        this.prisma = prisma;
    }

    async getAll() {
        return this.prisma.board.findMany({
            include: {
                lists: true,
                members: { include: { user: true } },
            },
        });
    }
}

export default BoardModel