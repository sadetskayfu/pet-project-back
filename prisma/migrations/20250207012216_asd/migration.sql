/*
  Warnings:

  - You are about to drop the column `emailConfirmationCode` on the `UnconfirmedUser` table. All the data in the column will be lost.
  - You are about to drop the column `emailConfirmationCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailConfirmed` on the `User` table. All the data in the column will be lost.
  - Added the required column `confirmationCode` to the `UnconfirmedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UnconfirmedUser" DROP COLUMN "emailConfirmationCode",
ADD COLUMN     "confirmationCode" VARCHAR(6) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailConfirmationCode",
DROP COLUMN "isEmailConfirmed";
