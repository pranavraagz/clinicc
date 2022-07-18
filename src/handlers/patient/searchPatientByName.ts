import { Request, Response } from "express";
import Joi from "joi";
import { Patient } from "../../entity/patient";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function searchPatientByName(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).read("patient");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const schema = Joi.object({
      name: Joi.string(),
      limit: Joi.number().default(5),
    });

    const { value, error } = schema.validate(req.query);
    if (error != null) {
      logger.warn(error);
      res.status(401).json({ error: error.message });
    }

    const { name, limit } = value;

    const result = await AppDataSource.manager
      .createQueryBuilder(Patient, "patient")
      .select(["patient.name", "patient.id"])
      .where("name LIKE :searchTerm", { searchTerm: `%${name}%` })
      .limit(limit ?? 10)
      .getMany();
    res.status(200).send(result);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
