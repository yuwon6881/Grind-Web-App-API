import app from "../server";
import { user } from "./testData";
import prisma from "../db";
import { Settings } from "@prisma/client";
const request = require("supertest");

describe("Setting Endpoints", () => {
  let token: string;
  let setting: Settings;

  beforeEach(async () => {
    const response = await request(app).post("/user").send(user);
    token = response.body.token;
    const userWithSettings = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
      include: {
        Settings: true,
      },
    });
    setting = userWithSettings!.Settings!;
  });
  describe("GET /setting", () => {
    describe("when request is valid", () => {
      test("it should return a setting", async () => {
        const response = await request(app)
          .get(`/api/setting/${setting.id}`)
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(setting);
      });
    });
  });
});
