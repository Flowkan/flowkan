import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.subscriptionPlan.upsert({
    where: { name: "Free" },
    update: {},
    create: {
      name: "Free",
      maxBoards: 3,
      maxTasks: 50,
      maxMembersPerBoard: 3,
      aiDescriptionLimit: 5,
      aiAgentEnabled: false,
      storageLimitMB: 200,
    },
  });

  await prisma.subscriptionPlan.upsert({
    where: { name: "Pro" },
    update: {},
    create: {
      name: "Pro",
      maxBoards: null,
      maxTasks: null,
      maxMembersPerBoard: 20,
      aiDescriptionLimit: 30,
      aiAgentEnabled: true,
      storageLimitMB: 5000,
    },
  });

  await prisma.subscriptionPlan.upsert({
    where: { name: "Business" },
    update: {},
    create: {
      name: "Business",
      maxBoards: null,
      maxTasks: null,
      maxMembersPerBoard: null,
      aiDescriptionLimit: null,
      aiAgentEnabled: true,
      storageLimitMB: 1000000,
    },
  });
}

main()
  .then(() => {
    console.log("✅ Subscription plans seeded successfully");
  })
  .catch(console.error)
  .finally(() => prisma.$disconnect());
