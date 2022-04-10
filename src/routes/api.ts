import { Router } from "express";
import { health } from "../handlers/health";
import { patientRouter } from "./patient";

export const apiRouter = Router();

apiRouter.use("/patient", patientRouter);

apiRouter.get("/health", health);
apiRouter.get("/", health);
