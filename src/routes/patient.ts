import { Router } from "express";
import { createPatient } from "../handlers/patient/createPatient";
import { getAllPatients } from "../handlers/patient/getAllPatients";
import { getPatient } from "../handlers/patient/getPatient";
import { searchPatientByName } from "../handlers/patient/searchPatientByName";

export const patientRouter = Router();

patientRouter.post("/search", searchPatientByName);
patientRouter.post("/", createPatient);
patientRouter.get("/all", getAllPatients);
patientRouter.get("/:id", getPatient);
