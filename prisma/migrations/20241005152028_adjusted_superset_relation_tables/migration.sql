/*
  Warnings:

  - You are about to drop the column `routine_uuid` on the `Routine_Superset` table. All the data in the column will be lost.
  - You are about to drop the `_Custom_ExerciseToRoutine_Superset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExerciseToRoutine_Superset` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[routine_uuid]` on the table `Routine_Custom_Exercise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[routine_uuid]` on the table `Routine_Exercise` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_Custom_ExerciseToRoutine_Superset" DROP CONSTRAINT "_Custom_ExerciseToRoutine_Superset_A_fkey";

-- DropForeignKey
ALTER TABLE "_Custom_ExerciseToRoutine_Superset" DROP CONSTRAINT "_Custom_ExerciseToRoutine_Superset_B_fkey";

-- DropForeignKey
ALTER TABLE "_ExerciseToRoutine_Superset" DROP CONSTRAINT "_ExerciseToRoutine_Superset_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExerciseToRoutine_Superset" DROP CONSTRAINT "_ExerciseToRoutine_Superset_B_fkey";

-- AlterTable
ALTER TABLE "Routine_Superset" DROP COLUMN "routine_uuid";

-- DropTable
DROP TABLE "_Custom_ExerciseToRoutine_Superset";

-- DropTable
DROP TABLE "_ExerciseToRoutine_Superset";

-- CreateTable
CREATE TABLE "RoutineSuperset_Exercise" (
    "id" TEXT NOT NULL,
    "supersets_id" TEXT NOT NULL,
    "routine_uuid" TEXT NOT NULL,

    CONSTRAINT "RoutineSuperset_Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutineSuperset_CustomExercise" (
    "id" TEXT NOT NULL,
    "supersets_id" TEXT NOT NULL,
    "routine_uuid" TEXT NOT NULL,

    CONSTRAINT "RoutineSuperset_CustomExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoutineSuperset_Exercise_routine_uuid_key" ON "RoutineSuperset_Exercise"("routine_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "RoutineSuperset_CustomExercise_routine_uuid_key" ON "RoutineSuperset_CustomExercise"("routine_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Routine_Custom_Exercise_routine_uuid_key" ON "Routine_Custom_Exercise"("routine_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Routine_Exercise_routine_uuid_key" ON "Routine_Exercise"("routine_uuid");

-- AddForeignKey
ALTER TABLE "RoutineSuperset_Exercise" ADD CONSTRAINT "RoutineSuperset_Exercise_routine_uuid_fkey" FOREIGN KEY ("routine_uuid") REFERENCES "Routine_Exercise"("routine_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineSuperset_Exercise" ADD CONSTRAINT "RoutineSuperset_Exercise_supersets_id_fkey" FOREIGN KEY ("supersets_id") REFERENCES "Routine_Superset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineSuperset_CustomExercise" ADD CONSTRAINT "RoutineSuperset_CustomExercise_routine_uuid_fkey" FOREIGN KEY ("routine_uuid") REFERENCES "Routine_Custom_Exercise"("routine_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineSuperset_CustomExercise" ADD CONSTRAINT "RoutineSuperset_CustomExercise_supersets_id_fkey" FOREIGN KEY ("supersets_id") REFERENCES "Routine_Superset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
