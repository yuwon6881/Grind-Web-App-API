import { Muscle } from "@prisma/client";
import prisma from "../db";
import app from "../server";
import { user, muscle } from "./testData";
import { Response } from "supertest";

import request from "supertest";

let token: string;

beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;
});

describe("Muscle Endpoints", () => {
  describe("GET /api/muscles", () => {
    describe("when request is valid", () => {
      it("should return a list of muscles", async () => {
        const response: Response = await request(app)
          .get("/api/muscles")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
      });
    });
  });
  describe("GET /api/muscle/:id", () => {
    let createdMuscle: Muscle;
    beforeEach(async () => {
      createdMuscle = await prisma.muscle.create({
        data: muscle,
      });
    });
    describe("when request is valid", () => {
      it("should return a muscle", async () => {
        const response: Response = await request(app)
          .get(`/api/muscle/${createdMuscle.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
      });
    });
    describe("when muscle doesnt exist", () => {
      it("should return error", async () => {
        const response: Response = await request(app)
          .get(`/api/muscle/123`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("Muscle not found");
      });
    });
  });

  describe("POST /api/muscle", () => {
    describe("when request is valid", () => {
      it("should create a muscle", async () => {
        const response: Response = await request(app)
          .post(`/api/muscle`)
          .set("Authorization", `Bearer ${token}`)
          .send(muscle);

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject(muscle);
      });
    });
    describe("when name is missing", () => {
      it("should return error", async () => {
        const response: Response = await request(app)
          .post(`/api/muscle`)
          .set("Authorization", `Bearer ${token}`)
          .send({ name: "" });

        expect(response.status).toBe(400);
      });
    });
  });
  describe("DELETE /api/muscle/:id", () => {
    let createdMuscle: Muscle;
    beforeEach(async () => {
      createdMuscle = await prisma.muscle.create({
        data: muscle,
      });
    });
    describe("when request is valid", () => {
      it("should delete a muscle", async () => {
        const response: Response = await request(app)
          .delete(`/api/muscle/${createdMuscle.id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject(muscle);
      });
    });
    describe("when muscle doesnt exist", () => {
      it("should return error", async () => {
        const response: Response = await request(app)
          .delete(`/api/muscle/123`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("Failed to delete muscle");
      });
    });
  });
});
