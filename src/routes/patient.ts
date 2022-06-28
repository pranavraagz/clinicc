import { Router } from "express";
import { createPatient } from "../handlers/patient/createPatient";
import { deletePatient } from "../handlers/patient/deletePatient";
import { getAllPatients } from "../handlers/patient/getAllPatients";
import { getPatient } from "../handlers/patient/getPatient";
import { searchPatientByName } from "../handlers/patient/searchPatientByName";
import { updatePatient } from "../handlers/patient/updatePatient";
import { authenticateJWT } from "../middleware/auth";

export const patientRouter = Router();

patientRouter.post("/search", authenticateJWT, searchPatientByName);
patientRouter.post("/", authenticateJWT, createPatient);
patientRouter.put("/", authenticateJWT, updatePatient);
patientRouter.get("/all", authenticateJWT, getAllPatients);
patientRouter.get("/:id", authenticateJWT, getPatient);
patientRouter.delete("/:id", authenticateJWT, deletePatient);
