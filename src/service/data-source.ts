import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Patient } from "../entity/patient";
import { Doctor } from "../entity/doctor";
import { Appointment } from "../entity/appointment";
import { User } from "../entity/user";

dotenv.config();

const isSynchronize: boolean = process.env.NODE_ENV != "production";
console.log("Running in dev mode: synchronizing database...");

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "database/muthu-neuro-clinic.db",
  entities: [User, Patient, Doctor, Appointment],
  synchronize: isSynchronize,
});
