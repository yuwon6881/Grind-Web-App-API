import { deleteRoutine, getRoutines } from "../routines";
import { prismaMock } from "../../singleton";
import { request, response, next } from "./mocks";
import { routine, nestedFoldersRoutines } from "./mockData";

describe("getRoutines", () => {
  describe("when request is valid", () => {
    it("should return routines", async () => {
      request.user = { email: "test", id: "1" };
      prismaMock.folder.findMany.mockResolvedValue(nestedFoldersRoutines);
      await getRoutines(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: [routine] }),
      );
    });
  });
  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.user = { email: "test", id: "1" };
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

describe("deleteRoutine", () => {
  describe("when request is valid", () => {
    it("should return a routine", async () => {
      request.params = { id: "1" };
      prismaMock.routine.update.mockResolvedValue(routine);
      await deleteRoutine(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: routine }),
      );
    });
  });
  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.params = { id: "1" };
      prismaMock.routine.update.mockRejectedValue(new Error());
      await deleteRoutine(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to delete routine",
        }),
      );
    });
  });
});
