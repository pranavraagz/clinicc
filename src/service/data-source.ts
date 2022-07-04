import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Patient } from "../entity/patient";
import { Doctor } from "../entity/doctor";
import { Appointment } from "../entity/appointment";
import { User } from "../entity/user";
import { logger } from "./logger";

dotenv.config();

const isSynchronize: boolean = process.env.NODE_ENV != "production";
if (isSynchronize) {
  logger.info("Running in dev mode: synchronizing database...");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Patient, Doctor, Appointment],
  synchronize: isSynchronize,
  logging: false,
});
