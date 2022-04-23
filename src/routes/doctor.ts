import { Router } from "express";
import { createDoctor } from "../handlers/doctor/createDoctor";
import { getAllDoctors } from "../handlers/doctor/getAllDoctors";
import { getDoctor } from "../handlers/doctor/getDoctor";

export const doctorRouter = Router();

doctorRouter.get("/all", getAllDoctors);
doctorRouter.post("/", createDoctor);
doctorRouter.get("/:id", getDoctor);
