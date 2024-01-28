import { createRoutine, deleteRoutine, getRoutines } from "../routines";
import { prismaMock } from "../../singleton";
import { request, response, next } from "./mocks";
import { folders_routines, routine, user } from "./mockData";

describe("getRoutines", () => {
  describe("when request is valid", () => {
    it("should return routines", async () => {
      request.user = user;
      prismaMock.folder.findMany.mockResolvedValue([folders_routines]);
      await getRoutines(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: [routine] }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.user = user;
      prismaMock.folder.findMany.mockRejectedValue(new Error());
      await getRoutines(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to get routines",
        }),
      );
    });
  });
});

describe("createRoutine", () => {
  describe("when request is valid", () => {
    it("should return a routine", async () => {
      request.body = { name: "test", folder_id: 1 };
      prismaMock.routine.create.mockResolvedValue(routine);
      await createRoutine(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: routine }),
      );
    });
  });
  describe("when folder for routine doesnt exist", () => {
    it("should return error", async () => {
      request.body = { name: "test", folder_id: 1 };
      prismaMock.routine.create.mockRejectedValue(
        Object.assign(new Error(), { code: "P2025" }),
      );
      await createRoutine(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Folder for routine doesnt exist",
          name: "inputError",
        }),
      );
    });
  });
  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.body = { name: "test", folder_id: 1 };
      prismaMock.routine.create.mockRejectedValue(new Error());
      await createRoutine(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to create routine",
        }),
      );
    });
  });
});

describe("deleteRoutine", () => {
  describe("when request is valid", () => {
    it("should return a routine", async () => {
      request.params = { id: "1" };
      prismaMock.routine.delete.mockResolvedValue(routine);
      await deleteRoutine(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: routine }),
      );
    });
  });
  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.params = { id: "1" };
      prismaMock.routine.delete.mockRejectedValue(new Error());
      await deleteRoutine(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to delete routine",
        }),
      );
    });
  });
});
