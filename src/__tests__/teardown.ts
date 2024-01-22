import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async () => {
  await prisma.$executeRaw`DROP DATABASE grindtest;`;
};
