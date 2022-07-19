import { Request, Response } from "express";
import Joi from "joi";
import { ac } from "../../service/access-control";
import { backup, compressFile } from "../../service/backup/backup";
import { logger } from "../../service/logger";
import * as path from "path";
import * as fs from "fs";

export async function getBackup(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).read("backup");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const { value, error } = Joi.object({
      compress: Joi.boolean().optional().default(true),
    }).validate(req.query);

    if (error) {
      return res.status(400).send(error);
    }

    const { compress } = value;

    // Generate the backup
    const filename =
      process.cwd() + "/database/" + (process.env.DB_NAME ?? "clinic") + ".db";
    let backupFilePath = await backup(filename);
    let compressedBackupFilePath: string | null = null;
    if (compress) {
      compressedBackupFilePath = compressFile(backupFilePath);
    }

    // Send download
    const toDownload = compressedBackupFilePath ?? backupFilePath;
    const outfilename = path.basename(toDownload);
    res.download(toDownload, outfilename, () => {
      // Delete created files after download is done
      fs.unlink(backupFilePath, () => {});
      if (compressedBackupFilePath)
        fs.unlink(compressedBackupFilePath, () => {});
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
