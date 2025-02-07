/*
  Warnings:

  - You are about to alter the column `emailConfirmationCode` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(6)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "emailConfirmationCode" SET DATA TYPE VARCHAR(6);

-- CreateTable
CREATE TABLE "UnconfirmedUser" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "country" VARCHAR(2) NOT NULL,
    "emailConfirmationCode" VARCHAR(6) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnconfirmedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnconfirmedUser_email_key" ON "UnconfirmedUser"("email");
