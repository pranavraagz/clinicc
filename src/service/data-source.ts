import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Patient } from "../entity/patient";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Patient],
  synchronize: true,
  logging: false,
});
