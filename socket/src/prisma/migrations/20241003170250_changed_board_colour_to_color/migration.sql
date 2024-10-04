/*
  Warnings:

  - You are about to drop the column `userBoardColour` on the `UsersBoards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsersBoards" DROP COLUMN "userBoardColour",
ADD COLUMN     "color" TEXT NOT NULL DEFAULT 'black';
