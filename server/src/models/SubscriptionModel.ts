import { PrismaClient, UserSubscription } from "@prisma/client";

class SubscriptionModel {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByUserId(userId: number): Promise<UserSubscription | null> {
    return this.prisma.userSubscription.findUnique({ where: { userId } });
  }

  async createSubscription(data: {
    userId: number;
    planId: number;
    endDate?: Date;
    autoRenew?: boolean;
    paymentProvider?: string;
    externalSubscriptionId?: string;
  }): Promise<UserSubscription> {
    return this.prisma.userSubscription.create({
      data,
    });
  }

  async cancelSubscription(userId: number): Promise<UserSubscription> {
    return this.prisma.userSubscription.update({
      where: { userId },
      data: { status: "CANCELED" },
    });
  }

  async expireSubscription(userId: number): Promise<UserSubscription> {
    // Útil para un job nocturno que marque expiradas
    return this.prisma.userSubscription.update({
      where: { userId },
      data: { status: "EXPIRED" },
    });
  }

  async renewSubscription(
    userId: number,
    months: number = 1,
  ): Promise<UserSubscription | null> {
    const sub = await this.findByUserId(userId);
    if (!sub) return null;

    const newEnd = sub.endDate ? new Date(sub.endDate) : new Date();

    newEnd.setMonth(newEnd.getMonth() + months);

    return this.prisma.userSubscription.update({
      where: { userId },
      data: {
        endDate: newEnd,
        status: "ACTIVE",
      },
    });
  }

  // Metodo para llamar desde cron y bajar a free los que tengan cancelada la subs
  async downgradeExpiredSubscriptionsToFree(): Promise<number> {
    const now = new Date();

    const freePlan = await this.prisma.subscriptionPlan.findUnique({
      where: { name: "Free" },
    });
    if (!freePlan)
      throw new Error("Plan Free no encontrado en la base de datos.");

    const expiredSubs = await this.prisma.userSubscription.findMany({
      where: {
        endDate: { lt: now },
        plan: { name: { not: "Free" } },
      },
      select: { userId: true },
    });

    const expiredUserIds: { userId: number }[] = expiredSubs;

    if (expiredUserIds.length === 0) return 0;

    await Promise.all(
      expiredUserIds.map(({ userId }: { userId: number }) =>
        this.prisma.userSubscription.update({
          where: { userId },
          data: {
            planId: freePlan.id,
            endDate: null,
            aiDescriptionCount: 0,
            currentStorageUsedMB: 0,
          },
        }),
      ),
    );

    return expiredUserIds.length;
  }
}

export default SubscriptionModel;
