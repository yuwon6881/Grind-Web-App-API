import app from "../server";
import { user } from "./testData";
import { Response } from "supertest";
import prisma from "../db";
import {
  Settings,
  previousWorkoutValue,
  theme,
  weightUnit,
} from "@prisma/client";
import request from "supertest";

describe("Setting Endpoints", () => {
  let token: string;
  let setting: Settings;

  beforeEach(async () => {
    const response: Response = await request(app).post("/register").send(user);
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
  describe("GET /api/setting", () => {
    describe("when request is valid", () => {
      it("should return a setting", async () => {
        const response: Response = await request(app)
          .get(`/api/setting`)
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(setting);
      });
    });
  });
  describe("UPDATE /api/setting", () => {
    describe("when request is valid", () => {
      it("should update a setting", async () => {
        const response: Response = await request(app)
          .put(`/api/setting`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            theme: theme.DARK,
            rpe: false,
            weightUnit: weightUnit.KG,
            previousWorkoutValue: previousWorkoutValue.Default,
          });

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual({
          ...setting,
          theme: theme.DARK,
          rpe: false,
        });
      });
    });
  });
});
