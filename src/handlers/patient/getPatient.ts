import { Request, Response } from "express";
import Joi from "joi";
import { Patient } from "../../entity/patient";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function getPatient(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).read("patient");
  if (!permission.granted) {
    return res.sendStatus(403);
  }

  const { value, error } = Joi.object({
    id: Joi.number().required(),
  }).validate(req.params);

  if (error != null) {
    res.status(401).json({ error: error.message });
    return;
  }
  const { id } = value;

  const patient = await AppDataSource.manager
    .getRepository(Patient)
    .findOneBy({ id: parseInt(id) });

  if (patient != null) {
    res.status(200).json(patient);
  } else {
    res.sendStatus(404);
  }
}
