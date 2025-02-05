/*
  Warnings:

  - You are about to drop the column `rating` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `ratingCount` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "rating",
DROP COLUMN "ratingCount",
ADD COLUMN     "averageRating" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "totalComments" INTEGER DEFAULT 0,
ADD COLUMN     "totalReviews" INTEGER DEFAULT 0;
