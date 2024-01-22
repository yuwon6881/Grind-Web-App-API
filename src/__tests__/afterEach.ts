import prisma from "../db";
afterEach(async () => {
  await prisma.$disconnect();
});
