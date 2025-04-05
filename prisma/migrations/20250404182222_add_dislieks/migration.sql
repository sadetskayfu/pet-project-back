/*
  Warnings:

  - A unique constraint covering the columns `[userId,commentId]` on the table `CommentLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,reviewId]` on the table `ReviewLike` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ReviewLike_reviewId_key";

-- DropIndex
DROP INDEX "ReviewLike_userId_key";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "totalDislikes" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "message" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "totalDislikes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ReviewDislike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,

    CONSTRAINT "ReviewDislike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentDislike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "CommentDislike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewDislike_userId_reviewId_key" ON "ReviewDislike"("userId", "reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentDislike_userId_commentId_key" ON "CommentDislike"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_userId_commentId_key" ON "CommentLike"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewLike_userId_reviewId_key" ON "ReviewLike"("userId", "reviewId");

-- AddForeignKey
ALTER TABLE "ReviewDislike" ADD CONSTRAINT "ReviewDislike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewDislike" ADD CONSTRAINT "ReviewDislike_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDislike" ADD CONSTRAINT "CommentDislike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDislike" ADD CONSTRAINT "CommentDislike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
