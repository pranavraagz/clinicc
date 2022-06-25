import { AppDataSource } from "../service/data-source";

const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSTypeORM = require("@adminjs/typeorm");

const express = require("express");

AdminJS.registerAdapter(AdminJSTypeORM);
const adminJs = new AdminJS({
  databases: [AppDataSource],
  rootPath: "/admin",
});

export const adminRouter = AdminJSExpress.buildRouter(adminJs);
