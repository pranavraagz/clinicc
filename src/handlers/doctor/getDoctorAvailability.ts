import { Request, Response } from "express";
import Joi from "joi";
import { Doctor } from "../../entity/doctor";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function getDoctorAvailability(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).read("doctor-availability");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const { value, error } = Joi.object({
      id: Joi.number().required(),
    }).validate(req.query);

    if (error) return res.status(400).send(error.message);

    const { id } = value;

    const doctor = await AppDataSource.manager
      .getRepository(Doctor)
      .findOneBy({ id: parseInt(id) });

    if (!doctor) return res.status(400).send("Doctor not found");

    return res.status(200).send(doctor.availability);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
