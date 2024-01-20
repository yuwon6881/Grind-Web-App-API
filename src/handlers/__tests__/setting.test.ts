import { prismaMock } from "../../singleton";
import { theme, weightUnit, previousWorkoutValue } from "@prisma/client";
import { getSetting, updateSetting } from "../setting";
import { request, response, next } from "./mocks";

// Test data
const settings = {
  id: "1",
  theme: theme.LIGHT,
  weightUnit: weightUnit.KG,
  rpe: true,
  previousWorkoutValue: previousWorkoutValue.Default,
  user_id: "1",
};

// Tests
describe("getSetting", () => {
  describe("when request is valid", () => {
    test("it should return a setting", async () => {
      request.params = { id: "1" };
      prismaMock.settings.findUnique.mockResolvedValue(settings);
      await getSetting(request, response, next);
      expect(response.json).toHaveBeenCalledWith({ data: settings });
    });
  });

  describe("when request is invalid", () => {
    test("it should return error", async () => {
      request.params = { id: "1" };
      prismaMock.settings.findUnique.mockRejectedValue(new Error());
      await getSetting(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Failed to get user setting" }),
      );
    });
  });
});

describe("updateSetting", () => {
  describe("when request is valid", () => {
    test("it should return a setting", async () => {
      request.body = settings;
      prismaMock.settings.update.mockResolvedValue(settings);
      await updateSetting(request, response, next);
      expect(response.json).toHaveBeenCalledWith({ data: settings });
    });
  });

  describe("when request is invalid", () => {
    test("it should return failed to update user setting error)", async () => {
      request.body = settings;
      prismaMock.settings.update.mockRejectedValue(new Error());
      await updateSetting(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Failed to update user setting" }),
      );
    });
  });
});
