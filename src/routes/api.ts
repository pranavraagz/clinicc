import { Router } from "express";
import { health } from "../handlers/health";
import { doctorRouter } from "./doctor";
import { patientRouter } from "./patient";

export const apiRouter = Router();

apiRouter.use("/patient", patientRouter);
apiRouter.use("/doctor", doctorRouter);

apiRouter.get("/health", health);
apiRouter.get("/", health);
