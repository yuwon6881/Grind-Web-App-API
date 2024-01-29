import app from "../server";
import { user } from "./testData";
import { Response } from "supertest";
import prisma from "../db";
import { Settings, theme } from "@prisma/client";
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
  describe("GET /api/setting/id", () => {
    describe("when request is valid", () => {
      it("should return a setting", async () => {
        const response: Response = await request(app)
          .get(`/api/setting/${setting.id}`)
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(setting);
      });
    });
    describe("when setting doesnt exists", () => {
      it("should return an empty array", async () => {
        const response: Response = await request(app)
          .get(`/api/setting/${setting.id + 1}`)
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("Setting not found");
      });
    });
  });
  describe("UPDATE /api/setting/id", () => {
    describe("when request is valid", () => {
      it("should update a setting", async () => {
        const response: Response = await request(app)
          .put(`/api/setting/${setting.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ theme: theme.DARK, rpe: false });

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual({
          ...setting,
          theme: theme.DARK,
          rpe: false,
        });
      });
    });
    describe("when setting doesnt exists", () => {
      it("should return an error", async () => {
        const response: Response = await request(app)
          .put(`/api/setting/${setting.id + 1}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ theme: theme.DARK, rpe: false });

        expect(response.status).toBe(404);
        expect(response.body.message).toEqual("Setting not found");
      });
    });
  });
});
