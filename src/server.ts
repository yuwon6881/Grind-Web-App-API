import express, { Request, Response, NextFunction } from "express";
import router from "./router";
import morgan from "morgan";
import { protect } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";
import {
  validateUserRegisterInput,
  validateUserSignInInput,
} from "./middlewares/validateUserInput";
import { errorHandler } from "./middlewares/errorhandler";
import "./middlewares/appErrorHandler";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response, next: NextFunction): void => {
  res.json({ message: "Hello World" });
});

app.use("/api", protect, router);

app.post("/user", validateUserRegisterInput, createNewUser);
app.post("/signIn", validateUserSignInInput, signIn);

app.use(errorHandler);

export default app;
