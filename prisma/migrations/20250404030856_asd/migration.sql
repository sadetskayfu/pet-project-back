/*
  Warnings:

  - You are about to drop the column `posterUrl` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `trailerUlr` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "posterUrl",
DROP COLUMN "trailerUlr",
DROP COLUMN "videoUrl";
