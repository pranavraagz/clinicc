import { Router } from "express";
import { createPatient } from "../handlers/patient/createPatient";

export const patientRouter = Router();

patientRouter.post("/", createPatient);
