import express from "express";
import * as dotenv from "dotenv";
const cors = require("cors");
import fileUpload from "express-fileupload";
import { apiRouter } from "./routes/api";
import { AppDataSource } from "./service/data-source";

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

AppDataSource.initialize().then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
