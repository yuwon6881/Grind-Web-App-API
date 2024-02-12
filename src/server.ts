import express, { Request, Response } from "express";
import router from "./router";
import morgan from "morgan";
import { protect, verifyJWT } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";
import {
  validateUserRegisterInput,
  validateUserSignInInput,
} from "./middlewares/validateUserInput";
import { errorHandler } from "./middlewares/errorhandler";
import "./middlewares/appErrorHandler";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(morgan("dev", { skip: () => process.env.NODE_ENV === "test" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Hello World" });
});

app.use("/api", protect, router);

app.post("/register", validateUserRegisterInput, createNewUser);
app.post("/signIn", validateUserSignInInput, signIn);
app.get("/verifyJWT", verifyJWT);

app.use(errorHandler);

export default app;
