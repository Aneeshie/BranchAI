/*
  Warnings:

  - You are about to drop the column `emailAddress` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_emailAddress_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailAddress";
