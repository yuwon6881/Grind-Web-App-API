/*
  Warnings:

  - You are about to drop the column `workout_SupersetId` on the `Custom_Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `exercise_type` on the `Routine_Set` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Custom_Exercise" DROP COLUMN "workout_SupersetId";

-- AlterTable
ALTER TABLE "Routine_Custom_Exercise" ALTER COLUMN "index" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Routine_Set" DROP COLUMN "exercise_type",
ADD COLUMN     "set_type" "set_type" NOT NULL DEFAULT 'NORMAL';
