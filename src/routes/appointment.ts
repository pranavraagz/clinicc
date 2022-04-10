import { Router } from "express";
import { createAppointment } from "../handlers/appointment/createAppointment";

export const appointmentRouter = Router();

appointmentRouter.post("/", createAppointment);
