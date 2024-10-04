/*
  Warnings:

  - The `boardJSON` column on the `Boards` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Boards" DROP COLUMN "boardJSON",
ADD COLUMN     "boardJSON" JSONB NOT NULL DEFAULT '{}';
