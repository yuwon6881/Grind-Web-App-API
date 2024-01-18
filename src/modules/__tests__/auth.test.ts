import { request, response, next } from "../../handlers/__tests__/mocks";
import { comparePasswords, hashPassword, createJWT, protect } from "../auth";
import bcrypt from "bcrypt";
import { Role, User } from "@prisma/client";
import jwt from "jsonwebtoken";

const user: User = {
  id: "1",
  name: "test",
  email: "test@test.com",
  createdAt: new Date(),
  password: "password",
  profilePicture: null,
  role: Role.ADMIN,
};

jest.mock("bcrypt", () => ({
  compare: jest.fn(() => Promise.resolve(true)),
  hash: jest.fn(() => Promise.resolve("hashedPassword")),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "token"),
  verify: jest.fn(() => user),
}));

describe("comparePasswords", () => {
  //Valid password
  test("should return true", async () => {
    const result = await comparePasswords("password", "hashedPassword");
    expect(result).toBe(true);
  });

  //Invalid password
  test("should throw error", async () => {
    (bcrypt.compare as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Failed to compare passwords");
    });
    await expect(
      comparePasswords("password", "hashedPassword"),
    ).rejects.toThrow("Failed to compare passwords");
  });
});

describe("hashPassword", () => {
  //Fine request
  test("should return hashed password", async () => {
    const result = await hashPassword("password");
    expect(result).toBe("hashedPassword");
  });

  //Failed request
  test("should throw error", async () => {
    (bcrypt.hash as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Failed to hash password");
    });
    await expect(hashPassword("password")).rejects.toThrow(
      "Failed to hash password",
    );
  });
});

describe("createJWT", () => {
  //Valid request
  test("should return a token", async () => {
    const result = createJWT(user);
    expect(result).toBe("token");
  });
});

describe("protect", () => {
  //Valid request
  test("should call next", async () => {
    request.headers = {
      authorization: "Bearer token",
    };
    protect(request, response, next);
    expect(next).toHaveBeenCalled();
  });

  //No token provided
  test("should return unauthorized no token provided", async () => {
    request.headers = {};
    protect(request, response, next);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Unauthorized, no token provided" }),
    );
  });

  //Invalid bearer token format
  test("should return unauthorized invalid token", async () => {
    request.headers = {
      authorization: "Bearer",
    };
    protect(request, response, next);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Unauthorized, invalid token" }),
    );
  });

  //Invalid token
  test("should return unauthorized invalid token", async () => {
    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Invalid token");
    });
    request.headers = {
      authorization: "Bearer token",
    };
    protect(request, response, next);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Unauthorized, invalid token" }),
    );
  });
});
