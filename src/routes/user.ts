import { Router } from "express";
import { createUser } from "../handlers/user/createStaff";
import { getAllUser } from "../handlers/user/getAllStaff";
import { loginUser } from "../handlers/user/loginStaff";

export const userRouter = Router();

userRouter.get("/all", getAllUser);
userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
