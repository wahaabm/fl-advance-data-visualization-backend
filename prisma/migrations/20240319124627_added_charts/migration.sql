/*
  Warnings:

  - You are about to drop the column `xValues` on the `Plot` table. All the data in the column will be lost.
  - You are about to drop the column `yValues` on the `Plot` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Plot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plot" DROP COLUMN "xValues",
DROP COLUMN "yValues",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "data" JSONB;

-- AddForeignKey
ALTER TABLE "Plot" ADD CONSTRAINT "Plot_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
