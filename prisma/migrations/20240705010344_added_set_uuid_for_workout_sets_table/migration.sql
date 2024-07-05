/*
  Warnings:

  - A unique constraint covering the columns `[set_uuid]` on the table `Workout_Sets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `set_uuid` to the `Workout_Sets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workout_Sets" ADD COLUMN     "set_uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workout_Sets_set_uuid_key" ON "Workout_Sets"("set_uuid");
