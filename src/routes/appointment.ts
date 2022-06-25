import { Router } from "express";

import { createAppointment } from "../handlers/appointment/createAppointment";
import { deleteAppointment } from "../handlers/appointment/deleteAppointment";
import { getAllAppointmentByDate } from "../handlers/appointment/getAllAppointmentByDate";
import { getAllAppointments } from "../handlers/appointment/getAllAppointments";
import { updateAppointment } from "../handlers/appointment/updateAppointment";
import { authenticateJWT } from "../middleware/auth";

export const appointmentRouter = Router();

appointmentRouter.get("/all", authenticateJWT, getAllAppointments);
appointmentRouter.post("/", authenticateJWT, createAppointment);
appointmentRouter.put("/", authenticateJWT, updateAppointment);
appointmentRouter.delete("/", authenticateJWT, deleteAppointment);
appointmentRouter.post("/bydate", authenticateJWT, getAllAppointmentByDate);
// appointmentRouter.post("/prescription", addPrescriptionImageToAppointment);
// appointmentRouter.get("/image/:name", getPrescriptionImageByName);
