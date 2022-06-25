import { Request, Response } from "express";
import Joi from "joi";
import { Doctor } from "../../entity/doctor";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function getDoctor(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).read("doctor");
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
    .getRepository(Doctor)
    .findOneBy({ id: parseInt(id) });

  if (patient) {
    res.status(200).json(patient);
  } else {
    res.sendStatus(404);
  }
}
