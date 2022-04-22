import { Request, response, Response } from "express";
import Joi from "joi";
import { Patient } from "../../entity/patient";
import { AppDataSource } from "../../service/data-source";

export async function getPatient(req: Request, res: Response) {
  const { id } = req.params;

  const patient = await AppDataSource.manager
    .getRepository(Patient)
    .findOneBy({ id: parseInt(id) });

  if (patient) {
    res.status(200).json(patient);
  } else {
    res.sendStatus(404);
  }
}
