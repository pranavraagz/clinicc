import { Request, response, Response } from "express";
import Joi from "joi";
import { Between } from "typeorm";
import { Appointment } from "../../entity/appointment";
import { AppDataSource } from "../../service/data-source";

export async function getAllAppointmentByDate(req: Request, res: Response) {
  const schema = Joi.object({
    date: Joi.date().required(),
  });

  const { value, error } = schema.validate(req.body);
  if (error != null) {
    console.log(error);
    response.status(401).json({ error: error.message });
  }

  const date = new Date(value.date);
  // add 24 hours
  const datePlus24 = new Date(date.getTime() + 1000 * 60 * 60 * 24);

  const result = await AppDataSource.manager
    .getRepository(Appointment)
    .findBy({ startTime: Between(date, datePlus24) });

  res.status(200).json(result);
}
