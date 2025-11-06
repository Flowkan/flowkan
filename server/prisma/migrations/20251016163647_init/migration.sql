-- AlterTable
ALTER TABLE "public"."Media" ADD COLUMN     "sizeMB" DOUBLE PRECISION NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "public"."SubscriptionPlan" ALTER COLUMN "storageLimitMB" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."UserSubscription" ALTER COLUMN "currentStorageUsedMB" SET DEFAULT 0.00,
ALTER COLUMN "currentStorageUsedMB" SET DATA TYPE DOUBLE PRECISION;
