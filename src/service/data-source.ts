import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Patient } from "../entity/patient";
import { Doctor } from "../entity/doctor";
import { Appointment } from "../entity/appointment";
import { Staff } from "../entity/staff";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "database/muthu-neuro-clinic.db",
});
