import { Router } from "express";
import { createAppointment } from "../handlers/appointment/createAppointment";
import { deleteAppointment } from "../handlers/appointment/deleteAppointment";
import { getAllAppointmentByDate } from "../handlers/appointment/getAllAppointmentByDate";

export const appointmentRouter = Router();

appointmentRouter.post("/", createAppointment);
appointmentRouter.delete("/", deleteAppointment);
appointmentRouter.post("/bydate", getAllAppointmentByDate);
