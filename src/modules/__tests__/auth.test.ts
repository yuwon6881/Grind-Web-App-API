import { request, response, next } from "../../handlers/__tests__/mocks";
import {
  comparePasswords,
  hashPassword,
  createJWT,
  protect,
  verifyJWT,
} from "../auth";
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
  it("should return true", async () => {
    const result = await comparePasswords("password", "hashedPassword");
    expect(result).toBe(true);
  });

  //Invalid password
  it("should throw error", async () => {
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
  it("should return hashed password", async () => {
    const result = await hashPassword("password");
    expect(result).toBe("hashedPassword");
  });

  //Failed request
  it("should throw error", async () => {
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
  it("should return a token", async () => {
    const result = createJWT(user);
    expect(result).toBe("token");
  });
});

describe("protect", () => {
  beforeEach(() => {
    request.cookies = {};
    response.clearCookie = jest.fn();
  });
  //Valid request
  it("should call next", async () => {
    request.headers = {
      authorization: "Bearer token",
    };
    protect(request, response, next);
    expect(next).toHaveBeenCalled();
  });

  //No token provided
  it("should return unauthorized no token provided", async () => {
    request.headers = {};
    protect(request, response, next);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Unauthorized, no token provided" }),
    );
  });

  //Invalid bearer token format
  it("should return unauthorized invalid token", async () => {
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
  it("should return unauthorized invalid token", async () => {
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

describe("verifyJWT", () => {
  //Valid request
  it("should return status 200", async () => {
    request.cookies = {
      token: "token",
    };
    response.clearCookie = jest.fn();
    verifyJWT(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true }),
    );
  });

  //Invalid token
  it("should return status 401", async () => {
    request.cookies = {};
    response.clearCookie = jest.fn();
    verifyJWT(request, response);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false }),
    );
  });
});
