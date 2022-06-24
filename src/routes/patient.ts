import { Router } from "express";
import { createPatient } from "../handlers/patient/createPatient";
import { getAllPatients } from "../handlers/patient/getAllPatients";
import { getPatient } from "../handlers/patient/getPatient";
import { searchPatientByName } from "../handlers/patient/searchPatientByName";
import { authenticateJWT } from "../middleware/auth";

export const patientRouter = Router();

patientRouter.post("/search", authenticateJWT, searchPatientByName);
patientRouter.post("/", authenticateJWT, createPatient);
patientRouter.get("/all", authenticateJWT, getAllPatients);
patientRouter.get("/:id", authenticateJWT, getPatient);
