import { Router } from "express";
import { health } from "../handlers/health";
import { appointmentRouter } from "./appointment";
import { doctorRouter } from "./doctor";
import { patientRouter } from "./patient";
import { staffRouter } from "./staff";

export const apiRouter = Router();

apiRouter.use("/staff", staffRouter);
apiRouter.use("/patient", patientRouter);
apiRouter.use("/doctor", doctorRouter);
apiRouter.use("/appointment", appointmentRouter);

apiRouter.get("/health", health);
apiRouter.get("/", health);
