import { Router } from "express";
import { createPatient } from "../handlers/patient/createPatient";
import { authenticateJWT } from "../middleware/auth";

export const patientRouter = Router();

patientRouter.post("/", authenticateJWT, createPatient);
