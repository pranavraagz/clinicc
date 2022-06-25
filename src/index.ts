import express from "express";
import * as dotenv from "dotenv";
const cors = require("cors");
import fileUpload from "express-fileupload";
import { apiRouter } from "./routes/api";
import { AppDataSource } from "./service/data-source";
import AdminJS from "adminjs";
import { User } from "./entity/user";
import { Database, Resource } from "@adminjs/typeorm";

dotenv.config();

const PORT = process.env.PORT ?? 8000;

const app = express();

User.useDataSource(AppDataSource);

AppDataSource.initialize().then(() => {
  const AdminJSExpress = require("@adminjs/express");

  AdminJS.registerAdapter({ Database, Resource });
  const adminJs = new AdminJS({
    databases: [AppDataSource],
    rootPath: "/admin",
  });

  const adminRouter = AdminJSExpress.buildRouter(adminJs);
  app.use("/admin", adminRouter);

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

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
