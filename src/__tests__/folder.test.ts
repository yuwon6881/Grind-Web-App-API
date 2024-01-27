import app from "../server";
import { user } from "./testData";
import { Response } from "supertest";

import request from "supertest";

let token: string;

beforeEach(async () => {
  const response: Response = await request(app).post("/register").send(user);
  token = response.body.token;
});

describe("Folder Endpoints", () => {
  describe("GET /folders", () => {
    describe("when request is valid", () => {
      it("should return a list of folders", async () => {
        const response: Response = await request(app)
          .get("/api/folders")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
      });
    });
  });
  describe("POST /folder", () => {
    describe("when request is valid", () => {
      it("should create a folder", async () => {
        const response: Response = await request(app)
          .post("/api/folder")
          .set("Authorization", `Bearer ${token}`)
          .send({ name: "testFolder" });

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject({
          name: "testFolder",
        });
      });
    });
  });
  describe("DELETE /folder/id", () => {
    let folderId: number;
    beforeEach(async () => {
      const response: Response = await request(app)
        .post("/api/folder")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "testFolder" });
      folderId = response.body.data.id;
    });
    describe("when request is valid", () => {
      it("should delete a folder", async () => {
        const response: Response = await request(app)
          .delete(`/api/folder/${folderId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject({
          name: "testFolder",
        });
      });
    });
    describe("when folder doesnt exists", () => {
      it("should return an error", async () => {
        const response: Response = await request(app)
          .delete(`/api/folder/${folderId + 1}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Folder not found");
      });
    });
  });
});
