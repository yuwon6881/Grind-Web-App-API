-- CreateEnum
CREATE TYPE "muscleType" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateEnum
CREATE TYPE "exerciseType" AS ENUM ('BARBELL', 'DUMBBELL', 'MACHINE', 'CABLE', 'BODYWEIGHT');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "set_type" AS ENUM ('NORMAL', 'DROPSET', 'LONG_LENGTH_PARTIAL');

-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_user_id_fkey";

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "index" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "index" INTEGER NOT NULL DEFAULT 0,
    "folder_id" TEXT NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "duration" DOUBLE PRECISION,
    "status" "status" NOT NULL DEFAULT 'IN_PROGRESS',
    "routine_id" TEXT NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout_Custom_Exercise" (
    "workout_id" TEXT NOT NULL,
    "custom_exercise_id" TEXT NOT NULL,
    "index" INTEGER NOT NULL DEFAULT 0,
    "rest_timer" DOUBLE PRECISION,
    "note" TEXT,

    CONSTRAINT "Workout_Custom_Exercise_pkey" PRIMARY KEY ("workout_id","custom_exercise_id")
);

-- CreateTable
CREATE TABLE "Workout_Exercise" (
    "workout_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "index" INTEGER NOT NULL DEFAULT 0,
    "rest_timer" DOUBLE PRECISION,
    "note" TEXT,

    CONSTRAINT "Workout_Exercise_pkey" PRIMARY KEY ("workout_id","exercise_id")
);

-- CreateTable
CREATE TABLE "Workout_Superset" (
    "id" TEXT NOT NULL,
    "workout_id" TEXT NOT NULL,

    CONSTRAINT "Workout_Superset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout_Sets" (
    "id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "reps" INTEGER,
    "rpe" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "index" INTEGER NOT NULL DEFAULT 0,
    "set_type" "set_type" NOT NULL DEFAULT 'NORMAL',
    "workout_id" TEXT NOT NULL,
    "exercise_id" TEXT,
    "custom_exercise_id" TEXT,

    CONSTRAINT "Workout_Sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personal_Record" (
    "id" TEXT NOT NULL,
    "workout_set_id" TEXT NOT NULL,

    CONSTRAINT "Personal_Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Custom_Muscle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Custom_Muscle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Custom_Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" BYTEA,
    "exerciseType" "exerciseType" NOT NULL,
    "user_id" TEXT NOT NULL,
    "workout_SupersetId" TEXT,

    CONSTRAINT "Custom_Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" BYTEA,
    "exerciseType" "exerciseType" NOT NULL,
    "workout_SupersetId" TEXT,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine_Custom_Exercise" (
    "routine_id" TEXT NOT NULL,
    "custom_exercise_id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "rest_timer" DOUBLE PRECISION,
    "note" TEXT,

    CONSTRAINT "Routine_Custom_Exercise_pkey" PRIMARY KEY ("routine_id","custom_exercise_id")
);

-- CreateTable
CREATE TABLE "Routine_Exercise" (
    "routine_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "index" INTEGER NOT NULL DEFAULT 0,
    "rest_timer" DOUBLE PRECISION,
    "note" TEXT,

    CONSTRAINT "Routine_Exercise_pkey" PRIMARY KEY ("routine_id","exercise_id")
);

-- CreateTable
CREATE TABLE "Routine_Superset" (
    "id" TEXT NOT NULL,
    "routine_id" TEXT NOT NULL,

    CONSTRAINT "Routine_Superset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine_Set" (
    "id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "reps" INTEGER,
    "rpe" DOUBLE PRECISION,
    "index" INTEGER NOT NULL DEFAULT 0,
    "exercise_type" "set_type" NOT NULL DEFAULT 'NORMAL',
    "routine_id" TEXT NOT NULL,
    "exercise_id" TEXT,
    "custom_exercise_id" TEXT,

    CONSTRAINT "Routine_Set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Muscle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Muscle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Custom_Exercise_Muscle" (
    "custom_exercise_id" TEXT NOT NULL,
    "muscle_id" TEXT NOT NULL,
    "muscleType" "muscleType" NOT NULL,

    CONSTRAINT "Custom_Exercise_Muscle_pkey" PRIMARY KEY ("custom_exercise_id","muscle_id")
);

-- CreateTable
CREATE TABLE "Exercise_Muscle" (
    "exercise_id" TEXT NOT NULL,
    "muscle_id" TEXT NOT NULL,
    "muscleType" "muscleType" NOT NULL,

    CONSTRAINT "Exercise_Muscle_pkey" PRIMARY KEY ("exercise_id","muscle_id")
);

-- CreateTable
CREATE TABLE "Custom_Muscle_Custom_Exercise" (
    "custom_muscle_id" TEXT NOT NULL,
    "custom_exercise_id" TEXT NOT NULL,
    "muscleType" "muscleType" NOT NULL,

    CONSTRAINT "Custom_Muscle_Custom_Exercise_pkey" PRIMARY KEY ("custom_muscle_id","custom_exercise_id")
);

-- CreateTable
CREATE TABLE "_Custom_ExerciseToRoutine_Superset" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Custom_ExerciseToWorkout_Superset" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExerciseToRoutine_Superset" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExerciseToWorkout_Superset" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Personal_Record_workout_set_id_key" ON "Personal_Record"("workout_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "_Custom_ExerciseToRoutine_Superset_AB_unique" ON "_Custom_ExerciseToRoutine_Superset"("A", "B");

-- CreateIndex
CREATE INDEX "_Custom_ExerciseToRoutine_Superset_B_index" ON "_Custom_ExerciseToRoutine_Superset"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Custom_ExerciseToWorkout_Superset_AB_unique" ON "_Custom_ExerciseToWorkout_Superset"("A", "B");

-- CreateIndex
CREATE INDEX "_Custom_ExerciseToWorkout_Superset_B_index" ON "_Custom_ExerciseToWorkout_Superset"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseToRoutine_Superset_AB_unique" ON "_ExerciseToRoutine_Superset"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseToRoutine_Superset_B_index" ON "_ExerciseToRoutine_Superset"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseToWorkout_Superset_AB_unique" ON "_ExerciseToWorkout_Superset"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseToWorkout_Superset_B_index" ON "_ExerciseToWorkout_Superset"("B");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Custom_Exercise" ADD CONSTRAINT "Workout_Custom_Exercise_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Custom_Exercise" ADD CONSTRAINT "Workout_Custom_Exercise_custom_exercise_id_fkey" FOREIGN KEY ("custom_exercise_id") REFERENCES "Custom_Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Exercise" ADD CONSTRAINT "Workout_Exercise_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Exercise" ADD CONSTRAINT "Workout_Exercise_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Superset" ADD CONSTRAINT "Workout_Superset_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Sets" ADD CONSTRAINT "Workout_Sets_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Sets" ADD CONSTRAINT "Workout_Sets_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Sets" ADD CONSTRAINT "Workout_Sets_custom_exercise_id_fkey" FOREIGN KEY ("custom_exercise_id") REFERENCES "Custom_Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personal_Record" ADD CONSTRAINT "Personal_Record_workout_set_id_fkey" FOREIGN KEY ("workout_set_id") REFERENCES "Workout_Sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Custom_Muscle" ADD CONSTRAINT "Custom_Muscle_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Custom_Exercise" ADD CONSTRAINT "Custom_Exercise_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_Custom_Exercise" ADD CONSTRAINT "Routine_Custom_Exercise_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_Custom_Exercise" ADD CONSTRAINT "Routine_Custom_Exercise_custom_exercise_id_fkey" FOREIGN KEY ("custom_exercise_id") REFERENCES "Custom_Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_Exercise" ADD CONSTRAINT "Routine_Exercise_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_Exercise" ADD CONSTRAINT "Routine_Exercise_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_Superset" ADD CONSTRAINT "Routine_Superset_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_Set" ADD CONSTRAINT "Routine_Set_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_Set" ADD CONSTRAINT "Routine_Set_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_Set" ADD CONSTRAINT "Routine_Set_custom_exercise_id_fkey" FOREIGN KEY ("custom_exercise_id") REFERENCES "Custom_Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Custom_Exercise_Muscle" ADD CONSTRAINT "Custom_Exercise_Muscle_custom_exercise_id_fkey" FOREIGN KEY ("custom_exercise_id") REFERENCES "Custom_Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Custom_Exercise_Muscle" ADD CONSTRAINT "Custom_Exercise_Muscle_muscle_id_fkey" FOREIGN KEY ("muscle_id") REFERENCES "Muscle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise_Muscle" ADD CONSTRAINT "Exercise_Muscle_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise_Muscle" ADD CONSTRAINT "Exercise_Muscle_muscle_id_fkey" FOREIGN KEY ("muscle_id") REFERENCES "Muscle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Custom_Muscle_Custom_Exercise" ADD CONSTRAINT "Custom_Muscle_Custom_Exercise_custom_muscle_id_fkey" FOREIGN KEY ("custom_muscle_id") REFERENCES "Custom_Muscle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Custom_Muscle_Custom_Exercise" ADD CONSTRAINT "Custom_Muscle_Custom_Exercise_custom_exercise_id_fkey" FOREIGN KEY ("custom_exercise_id") REFERENCES "Custom_Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Custom_ExerciseToRoutine_Superset" ADD CONSTRAINT "_Custom_ExerciseToRoutine_Superset_A_fkey" FOREIGN KEY ("A") REFERENCES "Custom_Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Custom_ExerciseToRoutine_Superset" ADD CONSTRAINT "_Custom_ExerciseToRoutine_Superset_B_fkey" FOREIGN KEY ("B") REFERENCES "Routine_Superset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Custom_ExerciseToWorkout_Superset" ADD CONSTRAINT "_Custom_ExerciseToWorkout_Superset_A_fkey" FOREIGN KEY ("A") REFERENCES "Custom_Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Custom_ExerciseToWorkout_Superset" ADD CONSTRAINT "_Custom_ExerciseToWorkout_Superset_B_fkey" FOREIGN KEY ("B") REFERENCES "Workout_Superset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToRoutine_Superset" ADD CONSTRAINT "_ExerciseToRoutine_Superset_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToRoutine_Superset" ADD CONSTRAINT "_ExerciseToRoutine_Superset_B_fkey" FOREIGN KEY ("B") REFERENCES "Routine_Superset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToWorkout_Superset" ADD CONSTRAINT "_ExerciseToWorkout_Superset_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToWorkout_Superset" ADD CONSTRAINT "_ExerciseToWorkout_Superset_B_fkey" FOREIGN KEY ("B") REFERENCES "Workout_Superset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
