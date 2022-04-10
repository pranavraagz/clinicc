import { Router } from "express";
import { createDoctor } from "../handlers/doctor/createDoctor";

export const doctorRouter = Router();

doctorRouter.post("/", createDoctor);
