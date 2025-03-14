/*
  Warnings:

  - Added the required column `name` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `BankAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "mask" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "officialName" TEXT,
ADD COLUMN     "subtype" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;
