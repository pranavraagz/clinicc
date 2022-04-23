import { Router } from "express";
import { createDoctor } from "../handlers/doctor/createDoctor";
import { getAllDoctors } from "../handlers/doctor/getAllDoctors";

export const doctorRouter = Router();

doctorRouter.post("/", createDoctor);
doctorRouter.get("/all", getAllDoctors);
