import { prismaMock } from "../../singleton";
import { getMuscles, getMuscle, createMuscle, deleteMuscle } from "../muscle";
import { request, response, next } from "./mocks";
import { muscle } from "./mockData";

// Tests
describe("getMuscles", () => {
  describe("when request is valid", () => {
    it("should return muscles", async () => {
      prismaMock.muscle.findMany.mockResolvedValue([muscle]);
      await getMuscles(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [muscle],
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      prismaMock.muscle.findMany.mockRejectedValue(new Error());
      await getMuscles(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to get muscles",
        }),
      );
    });
  });
});

describe("getMuscle", () => {
  describe("when request is valid", () => {
    it("should return muscle", async () => {
      prismaMock.muscle.findUnique.mockResolvedValue(muscle);
      request.params = { id: muscle.id };
      await getMuscle(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: muscle,
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      prismaMock.muscle.findUnique.mockRejectedValue(new Error());
      await getMuscle(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to get muscle",
        }),
      );
    });
  });
});

describe("createMuscle", () => {
  describe("when request is valid", () => {
    it("should return muscle", async () => {
      request.body = muscle;
      prismaMock.muscle.create.mockResolvedValue(muscle);
      await createMuscle(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: muscle,
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.body = muscle;
      prismaMock.muscle.create.mockRejectedValue(new Error());
      await createMuscle(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to create muscle",
        }),
      );
    });
  });
});

describe("deleteMuscle", () => {
  describe("when request is valid", () => {
    it("should return deleted muscle", async () => {
      prismaMock.muscle.findFirstOrThrow.mockResolvedValue(muscle);
      request.params = { id: muscle.id };
      await deleteMuscle(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: muscle,
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      prismaMock.muscle.delete.mockRejectedValue(new Error());
      await deleteMuscle(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to delete muscle",
        }),
      );
    });
  });
});
