import { Router } from "express";
import { createStaff } from "../handlers/staff/createStaff";
import { getAllStaff } from "../handlers/staff/getAllStaff";
import { loginStaff } from "../handlers/staff/loginStaff";

export const staffRouter = Router();

staffRouter.get("/all", getAllStaff);
staffRouter.post("/", createStaff);
staffRouter.post("/login", loginStaff);
