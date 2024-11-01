-- AlterTable
ALTER TABLE "Personal_Record" ADD COLUMN     "custom_exercise_id" TEXT,
ADD COLUMN     "exercise_id" TEXT;

-- AddForeignKey
ALTER TABLE "Personal_Record" ADD CONSTRAINT "Personal_Record_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personal_Record" ADD CONSTRAINT "Personal_Record_custom_exercise_id_fkey" FOREIGN KEY ("custom_exercise_id") REFERENCES "Custom_Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
