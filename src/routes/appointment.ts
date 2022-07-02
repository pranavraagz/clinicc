import { Router } from "express";

import { createAppointment } from "../handlers/appointment/createAppointment";
import { deleteAppointment } from "../handlers/appointment/deleteAppointment";
import { getAllAppointmentByDate } from "../handlers/appointment/getAllAppointmentByDate";
import { getAllAppointments } from "../handlers/appointment/getAllAppointments";
import { getAppointmentRowCount } from "../handlers/appointment/getAppointmentRowCount";
import { getAppointmentsFromToday } from "../handlers/appointment/getAppointmentsFromToday";
import { updateAppointment } from "../handlers/appointment/updateAppointment";
import { authenticateJWT } from "../middleware/auth";

export const appointmentRouter = Router();

appointmentRouter.get("/", authenticateJWT, getAllAppointments); // not recommended
appointmentRouter.get("/count", authenticateJWT, getAppointmentRowCount);
appointmentRouter.post("/", authenticateJWT, createAppointment);
appointmentRouter.put("/", authenticateJWT, updateAppointment);
appointmentRouter.delete("/:id", authenticateJWT, deleteAppointment);
appointmentRouter.get("/fromtoday", authenticateJWT, getAppointmentsFromToday);
// appointmentRouter.post("/prescription", addPrescriptionImageToAppointment);
// appointmentRouter.get("/image/:name", getPrescriptionImageByName);
