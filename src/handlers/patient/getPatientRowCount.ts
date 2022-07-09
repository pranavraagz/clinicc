import { Request, Response } from "express";
import { Patient } from "../../entity/patient";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function getPatientRowCount(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).read("patient");

    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const result = await AppDataSource.manager.getRepository(Patient).count();

    res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
