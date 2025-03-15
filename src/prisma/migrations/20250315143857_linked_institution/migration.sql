/*
  Warnings:

  - You are about to drop the `BankAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_userId_fkey";

-- DropTable
DROP TABLE "BankAccount";

-- CreateTable
CREATE TABLE "LinkedInstitution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkedInstitution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LinkedInstitution" ADD CONSTRAINT "LinkedInstitution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
