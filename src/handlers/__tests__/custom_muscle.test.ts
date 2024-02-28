import { prismaMock } from "../../singleton";
import {
  getCustomMuscles,
  getCustomMuscle,
  createCustomMuscle,
  deleteCustomMuscle,
} from "../custom_muscle";
import { request, response, next } from "./mocks";
import { customMuscle } from "./mockData";

// Tests
describe("getCustomMuscles", () => {
  describe("when request is valid", () => {
    it("should return custom muscles", async () => {
      prismaMock.custom_Muscle.findMany.mockResolvedValue([customMuscle]);
      await getCustomMuscles(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [customMuscle],
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      prismaMock.custom_Muscle.findMany.mockRejectedValue(new Error());
      await getCustomMuscles(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to get custom muscles",
        }),
      );
    });
  });
});

describe("getCustomMuscle", () => {
  describe("when request is valid", () => {
    it("should return custom muscle", async () => {
      prismaMock.custom_Muscle.findUnique.mockResolvedValue(customMuscle);
      request.params = { id: customMuscle.id };
      await getCustomMuscle(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: customMuscle,
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      prismaMock.custom_Muscle.findUnique.mockRejectedValue(new Error());
      await getCustomMuscle(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to get custom muscle",
        }),
      );
    });
  });
});

describe("createCustomMuscle", () => {
  describe("when request is valid", () => {
    it("should return custom muscle", async () => {
      prismaMock.custom_Muscle.create.mockResolvedValue(customMuscle);
      request.body = customMuscle;
      await createCustomMuscle(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: customMuscle,
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      prismaMock.custom_Muscle.create.mockRejectedValue(new Error());
      await createCustomMuscle(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to create custom muscle",
        }),
      );
    });
  });
});

describe("deleteCustomMuscle", () => {
  describe("when request is valid", () => {
    it("should return custom muscle", async () => {
      prismaMock.custom_Muscle.findFirstOrThrow.mockResolvedValue(customMuscle);
      request.params = { id: customMuscle.id };
      await deleteCustomMuscle(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: customMuscle,
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      prismaMock.custom_Muscle.delete.mockRejectedValue(new Error());
      await deleteCustomMuscle(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to delete custom muscle",
        }),
      );
    });
  });
});
