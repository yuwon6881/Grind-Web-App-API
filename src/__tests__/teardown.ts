import prisma from "../db";
export default async () => {
  await prisma.$disconnect();
  await prisma.$executeRaw`DROP DATABASE grindtest;`;
};
