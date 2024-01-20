import { prismaMock } from "../../singleton";
import { getFolders, createFolder, deleteFolder } from "../folder";
import { Folder, User, Role } from "@prisma/client";
import { request, response, next } from "./mocks";

// Test data
const folders: Folder[] = [
  {
    id: "1",
    name: "folder1",
    index: 1,
    user_id: "1",
  },
  {
    id: "2",
    name: "folder2",
    index: 2,
    user_id: "1",
  },
];

const user: User = {
  id: "1",
  createdAt: new Date(),
  name: "test",
  email: "test@test.com",
  password: "password",
  profilePicture: null,
  role: Role.USER,
};

const userFolder: User & { Folder: Folder[] } = {
  ...user,
  Folder: folders,
};

// Tests
describe("getFolders", () => {
  describe("when request is valid", () => {
    test("it should return folders", async () => {
      request.user = user;
      prismaMock.user.findUnique.mockResolvedValue(userFolder);
      await getFolders(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            Folder: folders,
          }),
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    test("it should return error", async () => {
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
    test("it should return folder", async () => {
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
    test("it should return error", async () => {
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
    test("it should return deleted folder", async () => {
      request.user = user;
      request.params = {
        id: folders[0].id,
      };
      prismaMock.folder.delete.mockResolvedValue(folders[0]);
      await deleteFolder(request, response, next);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: folders[0],
        }),
      );
    });
  });

  describe("when request is invalid", () => {
    test("it should return error", async () => {
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
