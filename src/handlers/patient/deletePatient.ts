import { Request, Response } from "express";
import Joi from "joi";
import { Patient } from "../../entity/patient";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function deletePatient(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).delete("patient");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const { value, error } = Joi.object({
      id: Joi.number().required(),
    }).validate(req.params);

    if (error) return res.status(400).send(error.message);
    const { id } = value;

    const patient = await AppDataSource.manager
      .getRepository(Patient)
      .findOneBy({ id: parseInt(id) });

    if (patient == null) {
      return res.status(400).send("Does not exist");
    }

    const deleteRes = await AppDataSource.manager
      .getRepository(Patient)
      .delete({ id: patient.id });

    if (deleteRes != null) {
      return res.status(200).json(patient);
    } else {
      return res.status(400).send("Error while deleting");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
