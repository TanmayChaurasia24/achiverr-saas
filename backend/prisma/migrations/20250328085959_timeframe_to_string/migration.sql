/*
  Warnings:

  - You are about to drop the column `progress` on the `Goal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "progress",
ALTER COLUMN "timeframe" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "RoadmapItem" ALTER COLUMN "day" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "day" SET DATA TYPE TEXT;
