import { Router } from "express";
import { createStaff } from "../handlers/staff/createStaff";

export const staffRouter = Router();

staffRouter.post("/", createStaff);
