import { prismaMock } from "../../singleton";
import { getSetting, updateSetting } from "../setting";
import { request, response, next } from "./mocks";
import { settings } from "./mockData";

// Tests
describe("getSetting", () => {
  describe("when request is valid", () => {
    it("should return a setting", async () => {
      request.user = { id: "1" };
      prismaMock.settings.findUnique.mockResolvedValue(settings);
      await getSetting(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: settings }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.user = { id: "1" };
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
    it("should return a setting", async () => {
      request.user = { id: "1" };
      prismaMock.settings.update.mockResolvedValue(settings);
      await updateSetting(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: settings }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return failed to update user setting error)", async () => {
      request.user = { id: "1" };
      prismaMock.settings.update.mockRejectedValue(new Error());
      await updateSetting(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Failed to update user setting" }),
      );
    });
  });
});
