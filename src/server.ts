import express, { Request, Response } from "express";
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

app.use(morgan("dev", { skip: () => process.env.NODE_ENV === "test" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Hello World" });
});

app.use("/api", protect, router);

app.post("/register", validateUserRegisterInput, createNewUser);
app.post("/signIn", validateUserSignInInput, signIn);

app.use(errorHandler);

export default app;
