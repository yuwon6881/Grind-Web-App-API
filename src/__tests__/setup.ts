import resetDb from "./resetDb";

export const request = require("supertest");

beforeEach(async () => {
  resetDb();
});
