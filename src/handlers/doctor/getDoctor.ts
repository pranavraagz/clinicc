import { Request, Response } from "express";
import Joi from "joi";
import { Doctor } from "../../entity/doctor";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function getDoctor(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).read("doctor");
    if (!permission.granted) {
      return res.sendStatus(403);
    }
    const { value, error } = Joi.object({
      id: Joi.number().required(),
    }).validate(req.params);

    if (error) {
      return res.status(400).send(error.message);
    }
    const { id } = value;

    const doctor = await AppDataSource.manager
      .getRepository(Doctor)
      .findOneBy({ id: parseInt(id) });

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
