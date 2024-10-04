-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_boardId_fkey";

-- DropForeignKey
ALTER TABLE "UsersBoards" DROP CONSTRAINT "UsersBoards_boardId_fkey";

-- DropForeignKey
ALTER TABLE "UsersBoards" DROP CONSTRAINT "UsersBoards_userId_fkey";

-- AddForeignKey
ALTER TABLE "UsersBoards" ADD CONSTRAINT "UsersBoards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBoards" ADD CONSTRAINT "UsersBoards_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Boards"("boardId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Boards"("boardId") ON DELETE CASCADE ON UPDATE CASCADE;
