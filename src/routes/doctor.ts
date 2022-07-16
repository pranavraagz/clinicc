import { Router } from "express";
import { createDoctor } from "../handlers/doctor/createDoctor";
import { getDoctor } from "../handlers/doctor/getDoctor";
import { authenticateJWT } from "../middleware/auth";

export const doctorRouter = Router();

doctorRouter.post("/", authenticateJWT, createDoctor);
doctorRouter.get("/:id", authenticateJWT, getDoctor);
