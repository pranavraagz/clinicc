import Database from "better-sqlite3";
import * as dotenv from "dotenv";
import fs from "fs";
import * as path from "path";
import * as brotli from "brotli";

dotenv.config();

/**
 *
 * @return path to newly created backup file
 */
export const backup = async (
  src: string,
  destination?: string
): Promise<string> => {
  let destDir = destination ? path.dirname(destination) : "backups";
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }
  const dest = destination ?? `${destDir}/backup-${Date.now()}.db`;

  const db = new Database(src);
  await db.backup(dest);
  db.close();
  return dest;
};

export const compressFile = (src: string, destination?: string): string => {
  if (!fs.existsSync(src)) {
    throw new Error("Provided file does not exist");
  }
  if (destination) {
    // Ensure destination directory exists
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir);
    }
  }
  const file = fs.readFileSync(src);
  const result = brotli.compress(file);
  const dest =
    destination ??
    path.dirname(src) + "/" + path.basename(src, path.extname(src)) + ".br";
  fs.writeFileSync(dest, result);
  return dest;
};

export const decompressFile = (src: string, destination?: string): string => {
  if (!fs.existsSync(src)) {
    throw new Error("Provided file does not exist");
  }
  if (destination) {
    // Ensure destination directory exists
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir);
    }
  }
  const result = brotli.decompress(fs.readFileSync(src));
  const dest =
    destination ??
    path.dirname(src) + "/" + path.basename(src, path.extname(src)) + ".br";
  fs.writeFileSync(dest, result);
  return dest;
};
