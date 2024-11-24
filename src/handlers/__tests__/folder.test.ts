import { prismaMock } from "../../singleton";
import { getFolders, createFolder, deleteFolder } from "../folder";
import { request, response, next } from "./mocks";
import { folders, userFolder, user } from "./mockData";

// Tests
describe("getFolders", () => {
  describe("when request is valid", () => {
    it("should return folders", async () => {
      request.user = user;
      prismaMock.user.findUnique.mockResolvedValue(userFolder);
      await getFolders(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: folders,
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.user = user;
      prismaMock.user.findUnique.mockRejectedValue(new Error());
      await getFolders(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to get folders",
        }),
      );
    });
  });
});

describe("createFolder", () => {
  describe("when request is valid", () => {
    it("should return folder", async () => {
      request.user = user;
      request.body = {
        name: folders[0].name,
      };
      prismaMock.folder.create.mockResolvedValue(folders[0]);
      await createFolder(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: folders[0],
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.user = user;
      request.body = {
        name: folders[0].name,
      };
      prismaMock.folder.create.mockRejectedValue(new Error());
      await createFolder(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to create folder",
        }),
      );
    });
  });
});

describe("deleteFolder", () => {
  describe("when request is valid", () => {
    it("should return deleted folder", async () => {
      request.user = user;
      request.params = {
        id: folders[0].id,
      };
      prismaMock.folder.findFirst.mockResolvedValue(folders[0]);
      prismaMock.folder.update.mockResolvedValue(folders[0]);
      await deleteFolder(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: folders[0],
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    it("should return error", async () => {
      request.user = user;
      request.params = {
        id: folders[0].id,
      };
      prismaMock.folder.delete.mockRejectedValue(new Error());
      await deleteFolder(request, response, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to delete folder",
        }),
      );
    });
  });
});
