import { Request, Response } from "express";
import Joi from "joi";
import { Between } from "typeorm";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function attendAppointment(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).updateAny("appointment-attend");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const { value, error } = Joi.object({
      id: Joi.number().required(),
      isAttended: Joi.bool().optional().default(false),
    }).validate(req.query);

    if (error != null) {
      return res.status(400).send(error);
    }

    const { id, isAttended } = value;

    const result = await AppDataSource.manager
      .getRepository(Appointment)
      .update({ id: id }, { isAttended: isAttended });

    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
