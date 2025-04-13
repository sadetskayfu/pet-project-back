/*
  Warnings:

  - You are about to drop the column `role` on the `Actor` table. All the data in the column will be lost.
  - Added the required column `role` to the `MovieActors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Actor" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "MovieActors" ADD COLUMN     "role" TEXT NOT NULL;
