/*
  Warnings:

  - You are about to drop the column `accountId` on the `LinkedInstitution` table. All the data in the column will be lost.
  - You are about to drop the column `bankId` on the `LinkedInstitution` table. All the data in the column will be lost.
  - Added the required column `institutionId` to the `LinkedInstitution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `LinkedInstitution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LinkedInstitution" DROP COLUMN "accountId",
DROP COLUMN "bankId",
ADD COLUMN     "institutionId" TEXT NOT NULL,
ADD COLUMN     "itemId" TEXT NOT NULL;
