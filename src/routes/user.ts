import { Router } from "express";
import { createUser } from "../handlers/user/createUser";
import { getUserRowCount } from "../handlers/user/getUserRowCount";
import { getUsers } from "../handlers/user/getUsers";
import { loginUser } from "../handlers/user/loginUser";
import { updateUser } from "../handlers/user/updateUser";
import { authenticateJWT } from "../middleware/auth";

export const userRouter = Router();

userRouter.get("/", authenticateJWT, getUsers);
userRouter.get("/count", authenticateJWT, getUserRowCount);
userRouter.post("/", authenticateJWT, createUser);
userRouter.put("/", authenticateJWT, updateUser);
userRouter.post("/login", loginUser);
