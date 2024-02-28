import { Custom_Muscle } from "@prisma/client";
import prisma from "../db";
import app from "../server";
import { user, custom_muscle } from "./testData";
import { Response } from "supertest";

import request from "supertest";

let token: string;

beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;
});

describe("Custom Muscle Endpoints", () => {
  describe("GET /api/custom_muscles", () => {
    describe("when request is valid", () => {
      it("should return a list of custom muscles", async () => {
        const response: Response = await request(app)
          .get("/api/custom_muscles")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
      });
    });
  });
  describe("GET /api/custom_muscle/:id", () => {
    let createdCustomMuscle: Custom_Muscle;
    beforeEach(async () => {
      const findUser = await prisma.user.findFirst();
      createdCustomMuscle = await prisma.custom_Muscle.create({
        data: {
          ...custom_muscle,
          belongsTo: { connect: { id: findUser!.id } },
        },
      });
    });
    describe("when request is valid", () => {
      it("should return a custom muscle", async () => {
        const response: Response = await request(app)
          .get(`/api/custom_muscle/${createdCustomMuscle.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
      });
    });
  });

  describe("POST /api/custom_muscle", () => {
    describe("when request is valid", () => {
      it("should create a custom muscle", async () => {
        const response: Response = await request(app)
          .post("/api/custom_muscle")
          .send(custom_muscle)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
      });
    });
  });

  describe("DELETE /api/custom_muscle/:id", () => {
    let createdCustomMuscle: Custom_Muscle;
    beforeEach(async () => {
      const findUser = await prisma.user.findFirst();
      createdCustomMuscle = await prisma.custom_Muscle.create({
        data: {
          ...custom_muscle,
          belongsTo: { connect: { id: findUser!.id } },
        },
      });
    });
    describe("when request is valid", () => {
      it("should delete a custom muscle", async () => {
        const response: Response = await request(app)
          .delete(`/api/custom_muscle/${createdCustomMuscle.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject(custom_muscle);
      });
    });
    describe("when request is invalid", () => {
      it("should return error", async () => {
        const response: Response = await request(app)
          .delete(`/api/custom_muscle/invalid_id`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("Failed to delete custom muscle");
      });
    });
  });
});
