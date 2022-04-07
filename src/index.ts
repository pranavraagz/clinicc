import express from "express";
import { AppDataSource } from "./service/data-source";

const PORT = 8000;

const app = express();

app.use(express.json());

AppDataSource.initialize().then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
