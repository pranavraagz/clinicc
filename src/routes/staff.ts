import { Router } from "express";
import { createStaff } from "../handlers/staff/createStaff";
import { loginStaff } from "../handlers/staff/loginStaff";

export const staffRouter = Router();

staffRouter.post("/", createStaff);
staffRouter.post("/login", loginStaff);
