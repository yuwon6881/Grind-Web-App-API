/*
  Warnings:

  - You are about to drop the `_Custom_ExerciseToWorkout_Superset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExerciseToWorkout_Superset` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[workout_uuid]` on the table `Workout_Custom_Exercise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workout_uuid]` on the table `Workout_Exercise` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_Custom_ExerciseToWorkout_Superset" DROP CONSTRAINT "_Custom_ExerciseToWorkout_Superset_A_fkey";

-- DropForeignKey
ALTER TABLE "_Custom_ExerciseToWorkout_Superset" DROP CONSTRAINT "_Custom_ExerciseToWorkout_Superset_B_fkey";

-- DropForeignKey
ALTER TABLE "_ExerciseToWorkout_Superset" DROP CONSTRAINT "_ExerciseToWorkout_Superset_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExerciseToWorkout_Superset" DROP CONSTRAINT "_ExerciseToWorkout_Superset_B_fkey";

-- DropTable
DROP TABLE "_Custom_ExerciseToWorkout_Superset";

-- DropTable
DROP TABLE "_ExerciseToWorkout_Superset";

-- CreateTable
CREATE TABLE "WorkoutSuperset_Exercise" (
    "id" TEXT NOT NULL,
    "supersets_id" TEXT NOT NULL,
    "workout_uuid" TEXT NOT NULL,

    CONSTRAINT "WorkoutSuperset_Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSuperset_CustomExercise" (
    "id" TEXT NOT NULL,
    "supersets_id" TEXT NOT NULL,
    "workout_uuid" TEXT NOT NULL,

    CONSTRAINT "WorkoutSuperset_CustomExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSuperset_Exercise_workout_uuid_key" ON "WorkoutSuperset_Exercise"("workout_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSuperset_CustomExercise_workout_uuid_key" ON "WorkoutSuperset_CustomExercise"("workout_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_Custom_Exercise_workout_uuid_key" ON "Workout_Custom_Exercise"("workout_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_Exercise_workout_uuid_key" ON "Workout_Exercise"("workout_uuid");

-- AddForeignKey
ALTER TABLE "WorkoutSuperset_Exercise" ADD CONSTRAINT "WorkoutSuperset_Exercise_workout_uuid_fkey" FOREIGN KEY ("workout_uuid") REFERENCES "Workout_Exercise"("workout_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSuperset_Exercise" ADD CONSTRAINT "WorkoutSuperset_Exercise_supersets_id_fkey" FOREIGN KEY ("supersets_id") REFERENCES "Workout_Superset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSuperset_CustomExercise" ADD CONSTRAINT "WorkoutSuperset_CustomExercise_workout_uuid_fkey" FOREIGN KEY ("workout_uuid") REFERENCES "Workout_Custom_Exercise"("workout_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSuperset_CustomExercise" ADD CONSTRAINT "WorkoutSuperset_CustomExercise_supersets_id_fkey" FOREIGN KEY ("supersets_id") REFERENCES "Workout_Superset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
