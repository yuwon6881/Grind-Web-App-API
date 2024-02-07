import { Folder, Routine } from "@prisma/client";
import prisma from "../db";
import app from "../server";
import { user } from "./testData";
import { Response } from "supertest";

import request from "supertest";
let token: string;

beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;
});

describe("Routine Endpoints", () => {
  describe("GET /api/routines", () => {
    let routine: Routine;
    beforeEach(async () => {
      const existedFolder: Folder[] = await prisma.folder.findMany();
      routine = await prisma.routine.create({
        data: {
          name: "test",
          folder_id: existedFolder[0].id,
        },
      });
    });
    describe("when request is valid", () => {
      it("should return routines", async () => {
        const response: Response = await request(app)
          .get("/api/routines")
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          data: [routine],
        });
      });
    });
  });
  describe("DELETE /api/routine/:id", () => {
    let routine: Routine;
    beforeEach(async () => {
      const existedFolder: Folder[] = await prisma.folder.findMany();
      routine = await prisma.routine.create({
        data: {
          name: "test",
          folder_id: existedFolder[0].id,
        },
      });
    });
    describe("when request is valid", () => {
      it("should return a routine", async () => {
        const response: Response = await request(app)
          .delete(`/api/routine/${routine.id}`)
          .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
      });
    });
    describe("when routine doesnt exist", () => {
      it("should return error", async () => {
        const response: Response = await request(app)
          .delete("/api/routine/100")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Routine doesnt exist" });
      });
    });
  });
});
