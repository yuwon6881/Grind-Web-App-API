/*
  Warnings:

  - A unique constraint covering the columns `[set_uuid]` on the table `Routine_Set` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `set_uuid` to the `Routine_Set` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Routine_Set" ADD COLUMN     "set_uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Routine_Set_set_uuid_key" ON "Routine_Set"("set_uuid");
