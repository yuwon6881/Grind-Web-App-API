import { execSync } from "child_process";
import config from "../config";
import { prisma } from "./setup";
import prismaTest from "../db";

export const initializeTestDb = async () => {
  const result: any[] =
    await prisma.$queryRaw`SELECT 1 FROM pg_database WHERE datname = 'grindtest'`;

  const env = {
    env: {
      ...process.env,
      DATABASE_URL: config.secrets.dbUrl,
    },
  };

  if (result.length === 0) {
    await prisma.$executeRaw`CREATE DATABASE grindtest`;
  }

  execSync("npx prisma migrate deploy", env);
};

export const resetDb = async () => {
  await prismaTest.$transaction([
    prismaTest.personal_Record.deleteMany(),
    prismaTest.workout_Sets.deleteMany(),
    prismaTest.workout_Exercise.deleteMany(),
    prismaTest.workout_Custom_Exercise.deleteMany(),
    prismaTest.workout_Superset.deleteMany(),
    prismaTest.workout.deleteMany(),
    prismaTest.routine_Set.deleteMany(),
    prismaTest.routine_Exercise.deleteMany(),
    prismaTest.routine_Custom_Exercise.deleteMany(),
    prismaTest.routine_Superset.deleteMany(),
    prismaTest.routine.deleteMany(),
    prismaTest.exercise_Muscle.deleteMany(),
    prismaTest.custom_Exercise_Muscle.deleteMany(),
    prismaTest.custom_Muscle_Custom_Exercise.deleteMany(),
    prismaTest.custom_Exercise.deleteMany(),
    prismaTest.muscle.deleteMany(),
    prismaTest.custom_Muscle.deleteMany(),
    prismaTest.folder.deleteMany(),
    prismaTest.settings.deleteMany(),
    prismaTest.user.deleteMany(),
    prismaTest.exercise.deleteMany(),
  ]);
};
