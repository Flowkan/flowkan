import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plans = [
    {
      name: "Free",
      maxBoards: 3,
      maxTasks: 50,
      maxMembersPerBoard: 3,
      aiDescriptionLimit: 5,
      aiAgentEnabled: false,
      storageLimitMB: 200,
    },
    {
      name: "Pro",
      maxBoards: null,
      maxTasks: null,
      maxMembersPerBoard: 20,
      aiDescriptionLimit: 30,
      aiAgentEnabled: true,
      storageLimitMB: 5000,
    },
    {
      name: "Business",
      maxBoards: null,
      maxTasks: null,
      maxMembersPerBoard: null,
      aiDescriptionLimit: null,
      aiAgentEnabled: true,
      storageLimitMB: 1000000,
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: { ...plan },
      create: plan,
    });
  }

  console.log("✅ Subscription plans seeded successfully");

  const freePlan = await prisma.subscriptionPlan.findUnique({
    where: { name: "Free" },
  });

  if (!freePlan) throw new Error("❌ Plan 'Free' no encontrado");

  const usersWithoutSub = await prisma.user.findMany({
    where: { subscription: null },
  });

  if (usersWithoutSub.length > 0) {
    await prisma.$transaction(
      usersWithoutSub.map((user: User) =>
        prisma.userSubscription.create({
          data: {
            userId: user.id,
            planId: freePlan.id,
            aiDescriptionCount: 0,
            currentStorageUsedMB: 0,
            startDate: new Date(),
            endDate: null,
          },
        }),
      ),
    );

    console.log(
      `✅ Se asignó el plan "Free" a ${usersWithoutSub.length} usuario(s)`,
    );
  } else {
    console.log("ℹ️ Todos los usuarios ya tienen suscripción");
  }
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
