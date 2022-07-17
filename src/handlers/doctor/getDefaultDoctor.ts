import { Request, Response } from "express";
import { Doctor } from "../../entity/doctor";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

const DEFAULT_DOCTOR_ID = 1;

export async function getDefaultDoctor(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).read("doctor");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const doctor = await AppDataSource.manager
      .getRepository(Doctor)
      .findOneBy({ id: DEFAULT_DOCTOR_ID });

    if (doctor) {
      res.status(200).send(doctor);
    } else {
      res.status(400).send("Doctor not found");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
