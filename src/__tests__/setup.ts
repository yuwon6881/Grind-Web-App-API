import config from "../config";
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const env = {
  env: {
    ...process.env,
    DATABASE_URL: config.secrets.dbUrl,
  },
};

export default async () => {
  await prisma.$executeRaw`CREATE DATABASE grindtest`;

  execSync("npx prisma migrate deploy", env);
};
