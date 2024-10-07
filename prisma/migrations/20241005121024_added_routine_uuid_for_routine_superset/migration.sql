/*
  Warnings:

  - Added the required column `routine_uuid` to the `Routine_Superset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Routine_Superset" ADD COLUMN     "routine_uuid" TEXT NOT NULL;
