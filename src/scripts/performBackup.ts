import { backup, compressFile } from "../service/backup/backup";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

export const runBackupWithCompression = async () => {
  const dbfilepath =
    process.cwd() + "/database/" + (process.env.DB_NAME ?? "clinic") + ".db";
  let backupFilePath: string;
  try {
    backupFilePath = await backup(dbfilepath);
  } catch (error) {
    console.error(error);
    return;
  }
  //   Compress the backup
  let outputPath: string;
  try {
    outputPath = compressFile(backupFilePath);
  } catch (error) {
    console.error(error);
    return;
  }
  //   Delete the uncompressed backup file
  fs.unlink(backupFilePath, () => {});

  // Do something with the compressed backup file and then delete it
};

const main = async () => {
  await runBackupWithCompression();
};

main();
