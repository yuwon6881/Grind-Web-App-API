import { Folder } from "@prisma/client";
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

describe("folder_routines Endpoints", () => {
  let folder: Folder[];
  beforeEach(async () => {
    folder = await prisma.folder.findMany();
  });
  describe("POST /api/routine", () => {
    describe("when request is valid", () => {
      it("should return a routine", async () => {
        const response: Response = await request(app)
          .post(`/api/folder/${folder[0].id}/routine`)
          .send({ name: "test" })
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
      });
    });
    describe("when name is missing from the body", () => {
      it("should return error", async () => {
        const response: Response = await request(app)
          .post(`/api/folder/${folder[0].id}/routine`)
          .send({})
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
      });
    });
  });
});
