/*
  Warnings:

  - A unique constraint covering the columns `[institutionId]` on the table `LinkedInstitution` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `LinkedInstitution` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `institutionName` to the `LinkedInstitution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LinkedInstitution" ADD COLUMN     "institutionName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LinkedInstitution_institutionId_key" ON "LinkedInstitution"("institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedInstitution_itemId_key" ON "LinkedInstitution"("itemId");
