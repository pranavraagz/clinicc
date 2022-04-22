import { Router } from "express";
import { createAppointment } from "../handlers/appointment/createAppointment";
import { deleteAppointment } from "../handlers/appointment/deleteAppointment";
import { getAllAppointmentByDate } from "../handlers/appointment/getAllAppointmentByDate";
import { updateAppointment } from "../handlers/appointment/updateAppointment";

export const appointmentRouter = Router();

appointmentRouter.post("/", createAppointment);
appointmentRouter.put("/", updateAppointment);
appointmentRouter.delete("/", deleteAppointment);
appointmentRouter.post("/bydate", getAllAppointmentByDate);
