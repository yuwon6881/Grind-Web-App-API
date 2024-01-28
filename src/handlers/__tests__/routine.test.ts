import { deleteRoutine } from "../routines";
import { prismaMock } from "../../singleton";
import { request, response, next } from "./mocks";
import { routine } from "./mockData";

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
