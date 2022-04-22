import { Router } from "express";
import { createAppointment } from "../handlers/appointment/createAppointment";
import { deleteAppointment } from "../handlers/appointment/deleteAppointment";

export const appointmentRouter = Router();

appointmentRouter.post("/", createAppointment);
appointmentRouter.delete("/", deleteAppointment);
