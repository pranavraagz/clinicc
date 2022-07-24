import express from "express";
import * as dotenv from "dotenv";
const cors = require("cors");
import fileUpload from "express-fileupload";
import { apiRouter } from "./routes/api";
import { AppDataSource } from "./service/data-source";
import { logger } from "./service/logger";
import morgan from "morgan";
import fs from "fs";
import path from "path";
dotenv.config();

const PORT = process.env.PORT ?? 8000;

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

if (process.env.NODE_ENV == "production") {
  app.use(
    morgan("common", {
      stream: fs.createWriteStream("./access.log", { flags: "a" }),
    })
  );
} else {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(
  cors({
    origin: "*",
    exposedHeaders: "Content-Disposition", // Required to download backup
  })
);

if (process.env.NODE_ENV == "production") app.use("/", express.static("dist/"));
app.use("/api/v1", apiRouter);

const dataSourceInitTimer = logger.startTimer();
AppDataSource.initialize().then(() => {
  dataSourceInitTimer.done({
    message: "Data Source Initialized",
  });
  app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
});
