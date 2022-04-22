import { Router } from "express";
import { createPatient } from "../handlers/patient/createPatient";
import { getPatient } from "../handlers/patient/getPatient";
import { searchPatientByName } from "../handlers/patient/searchPatientByName";
import { authenticateJWT } from "../middleware/auth";

export const patientRouter = Router();

patientRouter.post("/search", searchPatientByName);
patientRouter.post("/", createPatient);
patientRouter.get("/:id", getPatient);
