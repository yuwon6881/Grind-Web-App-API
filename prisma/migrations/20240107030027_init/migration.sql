-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "theme" AS ENUM ('DARK', 'LIGHT');

-- CreateEnum
CREATE TYPE "weightUnit" AS ENUM ('KG', 'LB');

-- CreateEnum
CREATE TYPE "previousWorkoutValue" AS ENUM ('Default', 'Template');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" BYTEA,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "theme" "theme" NOT NULL DEFAULT 'LIGHT',
    "weightUnit" "weightUnit" NOT NULL DEFAULT 'KG',
    "rpe" BOOLEAN NOT NULL DEFAULT true,
    "previousWorkoutValue" "previousWorkoutValue" NOT NULL DEFAULT 'Default',
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_user_id_key" ON "Settings"("user_id");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
