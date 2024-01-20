import { Request, Response, NextFunction } from "express";
export let request: Request, response: Response, next: NextFunction;

beforeAll(() => {
  request = {} as Request;

  response = {
    json: jest.fn().mockImplementation((json) => json),
    status: jest.fn().mockImplementation((status) => status),
  } as unknown as Response;
  next = jest.fn();
});
