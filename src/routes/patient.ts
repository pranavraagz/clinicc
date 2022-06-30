import { Router } from "express";
import { createPatient } from "../handlers/patient/createPatient";
import { deletePatient } from "../handlers/patient/deletePatient";
import { getAllPatients } from "../handlers/patient/getPatients";
import { getPatient } from "../handlers/patient/getPatient";
import { getPatientRowCount } from "../handlers/patient/getPatientRowCount";
import { searchPatientByName } from "../handlers/patient/searchPatientByName";
import { updatePatient } from "../handlers/patient/updatePatient";
import { authenticateJWT } from "../middleware/auth";

export const patientRouter = Router();

patientRouter.post("/", authenticateJWT, createPatient);
patientRouter.put("/", authenticateJWT, updatePatient);
patientRouter.get("/", authenticateJWT, getAllPatients);
patientRouter.get("/count", authenticateJWT, getPatientRowCount);
patientRouter.post("/search", authenticateJWT, searchPatientByName);
patientRouter.get("/:id", authenticateJWT, getPatient);
patientRouter.delete("/:id", authenticateJWT, deletePatient);
