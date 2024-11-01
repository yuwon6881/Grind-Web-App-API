/*
  Warnings:

  - Added the required column `user_id` to the `Personal_Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Personal_Record" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Personal_Record" ADD CONSTRAINT "Personal_Record_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
