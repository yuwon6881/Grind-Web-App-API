/*
  Warnings:

  - The primary key for the `Routine_Custom_Exercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Routine_Exercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `routine_uuid` to the `Routine_Custom_Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routine_uuid` to the `Routine_Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Routine_Custom_Exercise" DROP CONSTRAINT "Routine_Custom_Exercise_pkey",
ADD COLUMN     "routine_uuid" TEXT NOT NULL,
ADD CONSTRAINT "Routine_Custom_Exercise_pkey" PRIMARY KEY ("routine_id", "custom_exercise_id", "routine_uuid");

-- AlterTable
ALTER TABLE "Routine_Exercise" DROP CONSTRAINT "Routine_Exercise_pkey",
ADD COLUMN     "routine_uuid" TEXT NOT NULL,
ADD CONSTRAINT "Routine_Exercise_pkey" PRIMARY KEY ("routine_id", "exercise_id", "routine_uuid");
