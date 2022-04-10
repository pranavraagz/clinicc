import express from "express";
import { apiRouter } from "./routes/api";
import { AppDataSource } from "./service/data-source";

const PORT = 8000;

const app = express();

app.use(express.json());

app.use("/api/v1", apiRouter);

AppDataSource.initialize().then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
