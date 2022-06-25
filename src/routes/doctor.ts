import { Router } from "express";
import { createDoctor } from "../handlers/doctor/createDoctor";
import { getAllDoctors } from "../handlers/doctor/getAllDoctors";
import { getDoctor } from "../handlers/doctor/getDoctor";
import { authenticateJWT } from "../middleware/auth";

export const doctorRouter = Router();

doctorRouter.get("/all", authenticateJWT, getAllDoctors);
doctorRouter.post("/", authenticateJWT, createDoctor);
doctorRouter.get("/:id", authenticateJWT, getDoctor);
