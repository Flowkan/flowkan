/*
  Warnings:

  - The `dateBirth` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "location" TEXT,
ALTER COLUMN "username" DROP NOT NULL,
DROP COLUMN "dateBirth",
ADD COLUMN     "dateBirth" TIMESTAMP(3),
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "allowNotifications" DROP NOT NULL,
ALTER COLUMN "allowNotifications" SET DEFAULT true;
