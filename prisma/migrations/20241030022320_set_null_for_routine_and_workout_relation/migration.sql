-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_routine_id_fkey";

-- AlterTable
ALTER TABLE "Workout" ALTER COLUMN "routine_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "Routine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
