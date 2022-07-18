import { AppDataSource } from "../data-source";
import Database from "better-sqlite3";
import * as dotenv from "dotenv";
import fs from "fs";
import { logger } from "../logger";

dotenv.config();

export const backup = async () => {
  const filename = process.env.DB_NAME ?? "clinic";
  const sourceAddr = `database/${filename}.db`;
  const destDir = "backups";
  const destAddr = `${destDir}/backup-${Date.now()}.db`;

  let db;
  try {
    db = new Database(sourceAddr);
  } catch (error) {
    logger.error(error);
    return;
  }

  // Check if destination directory exists
  if (!fs.existsSync(destDir)) {
    // If not, create it
    fs.mkdirSync(destDir);
  }

  try {
    await db.backup(destAddr);
    logger.info("Database backup successful");
  } catch (error) {
    logger.error("Database backup failed", error);
  }
};

backup();
