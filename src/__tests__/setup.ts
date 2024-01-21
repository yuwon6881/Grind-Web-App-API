import { PrismaClient } from "@prisma/client";
import { resetDb, initializeTestDb } from "./dbSetup";

export const request = require("supertest");

export const prisma = new PrismaClient();

beforeAll(async () => {
  await initializeTestDb();
});

beforeEach(async () => {
  await resetDb();
});
