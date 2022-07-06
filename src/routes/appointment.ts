import { Router } from "express";

import { createAppointment } from "../handlers/appointment/createAppointment";
import { deleteAppointment } from "../handlers/appointment/deleteAppointment";
import { getAppointments } from "../handlers/appointment/getAppointments";
import { getAppointmentRowCount } from "../handlers/appointment/getAppointmentRowCount";
import { updateAppointment } from "../handlers/appointment/updateAppointment";
import { authenticateJWT } from "../middleware/auth";

export const appointmentRouter = Router();

appointmentRouter.get("/", authenticateJWT, getAppointments);
appointmentRouter.get("/count", authenticateJWT, getAppointmentRowCount);
appointmentRouter.post("/", authenticateJWT, createAppointment);
appointmentRouter.put("/", authenticateJWT, updateAppointment);
appointmentRouter.delete("/:id", authenticateJWT, deleteAppointment);
// appointmentRouter.post("/prescription", addPrescriptionImageToAppointment);
// appointmentRouter.get("/image/:name", getPrescriptionImageByName);
