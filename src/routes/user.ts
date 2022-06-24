import { Router } from "express";
import { createUser } from "../handlers/user/createUser";
import { getAllUser } from "../handlers/user/getAllUser";
import { loginUser } from "../handlers/user/loginUser";

export const userRouter = Router();

userRouter.get("/all", getAllUser);
userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
