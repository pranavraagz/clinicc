import express from "express";
import * as dotenv from "dotenv";
const cors = require("cors");
import fileUpload from "express-fileupload";
import { apiRouter } from "./routes/api";
import { AppDataSource } from "./service/data-source";
import { logger } from "./service/logger";

dotenv.config();

const PORT = process.env.PORT ?? 8000;

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1", apiRouter);

const dataSourceInitTimer = logger.startTimer();
AppDataSource.initialize().then(() => {
  dataSourceInitTimer.done({
    message: "Data Source Initialized",
  });
  app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
});
