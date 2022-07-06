import { Request, Response } from "express";
import Joi from "joi";
import { Between } from "typeorm";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function getAppointmentRowCount(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).read("appointment");

  if (!permission.granted) {
    return res.sendStatus(403);
  }

  const { value, error } = Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
  }).validate(req.query);
  if (error != null) {
    return res.status(400).send(error);
  }

  const { from, to } = value;
  const fromTime = new Date(from);
  const toTime = new Date(to);

  let result: number;
  result = await AppDataSource.manager.getRepository(Appointment).count({
    where: {
      startTime: Between(fromTime, toTime),
    },
  });

  res.status(200).json(result);
}
