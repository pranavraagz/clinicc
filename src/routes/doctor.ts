import { Router } from "express";
import { createDoctor } from "../handlers/doctor/createDoctor";
import { getDefaultDoctor } from "../handlers/doctor/getDefaultDoctor";
import { getDoctor } from "../handlers/doctor/getDoctor";
import { getDoctorAvailability } from "../handlers/doctor/getDoctorAvailability";
import { setDoctorAvailability } from "../handlers/doctor/setDoctorAvailability";
import { authenticateJWT } from "../middleware/auth";

export const doctorRouter = Router();

doctorRouter.post("/", authenticateJWT, createDoctor);
doctorRouter.get("/", authenticateJWT, getDoctor);
doctorRouter.get("/default", authenticateJWT, getDefaultDoctor);
doctorRouter.get("/availability", authenticateJWT, getDoctorAvailability);
doctorRouter.post("/availability", authenticateJWT, setDoctorAvailability);
