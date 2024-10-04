-- CreateTable
CREATE TABLE "Boards" (
    "boardId" TEXT NOT NULL,
    "boardTitle" TEXT NOT NULL,
    "membersCnt" INTEGER NOT NULL,
    "membersId" TEXT[],
    "notesId" TEXT[],
    "notesCnt" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boards_pkey" PRIMARY KEY ("boardId")
);

-- CreateTable
CREATE TABLE "UsersBoards" (
    "userId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,

    CONSTRAINT "UsersBoards_pkey" PRIMARY KEY ("userId","boardId")
);

-- CreateTable
CREATE TABLE "Notes" (
    "noteId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "noteTitle" TEXT NOT NULL,
    "noteBody" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("noteId")
);

-- AddForeignKey
ALTER TABLE "UsersBoards" ADD CONSTRAINT "UsersBoards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBoards" ADD CONSTRAINT "UsersBoards_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Boards"("boardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Boards"("boardId") ON DELETE RESTRICT ON UPDATE CASCADE;
