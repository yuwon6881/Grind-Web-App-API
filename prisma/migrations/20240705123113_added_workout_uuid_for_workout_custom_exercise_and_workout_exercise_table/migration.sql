/*
  Warnings:

  - The primary key for the `Workout_Custom_Exercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Workout_Exercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `workout_uuid` to the `Workout_Custom_Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workout_uuid` to the `Workout_Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workout_Custom_Exercise" DROP CONSTRAINT "Workout_Custom_Exercise_pkey",
ADD COLUMN     "workout_uuid" TEXT NOT NULL,
ADD CONSTRAINT "Workout_Custom_Exercise_pkey" PRIMARY KEY ("workout_id", "custom_exercise_id", "workout_uuid");

-- AlterTable
ALTER TABLE "Workout_Exercise" DROP CONSTRAINT "Workout_Exercise_pkey",
ADD COLUMN     "workout_uuid" TEXT NOT NULL,
ADD CONSTRAINT "Workout_Exercise_pkey" PRIMARY KEY ("workout_id", "exercise_id", "workout_uuid");
