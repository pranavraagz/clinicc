import { Request, Response } from "express";
import Joi from "joi";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function updateAppointment(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).update("appointment");
  if (!permission.granted) {
    return res.sendStatus(403);
  }
  const schema = Joi.object({
    id: Joi.number().required(),
    start: Joi.date().required(),
    duration_s: Joi.number().required(),
  });

  const { value, error } = schema.validate(req.body);
  if (error != null) {
    logger.warn(error);
    return res.status(401).json({ error: error.message });
  }

  const { start, duration_s, id } = value;

  const appointment = new Appointment();

  const startTime = new Date(start);

  appointment.startTime = startTime;
  appointment.duration = duration_s;

  const result = await AppDataSource.manager
    .getRepository(Appointment)
    .findOneBy({ id: id });

  if (result == null) {
    return res.status(404).json({ msg: "Appointment not found" });
  }

  result.startTime = startTime ?? result.startTime;
  result.duration = duration_s ?? result.duration;

  await AppDataSource.manager.save(result);

  res.sendStatus(200);
}
