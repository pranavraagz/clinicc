import { Request, response, Response } from "express";
import Joi from "joi";
import { Appointment } from "../../entity/appointment";
import { AppDataSource } from "../../service/data-source";

export async function updateAppointment(req: Request, res: Response) {
  const schema = Joi.object({
    id: Joi.number().required(),
    start: Joi.date().required(),
    duration_s: Joi.number().required(),
  });

  const { value, error } = schema.validate(req.body);
  if (error != null) {
    console.log(error);
    response.status(401).json({ error: error.message });
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
    res.status(404).json({ msg: "Appointment not found" });
    return;
  }

  result.startTime = startTime ?? result.startTime;
  result.duration = duration_s ?? result.duration;

  await AppDataSource.manager.save(result);

  res.sendStatus(200);
}
