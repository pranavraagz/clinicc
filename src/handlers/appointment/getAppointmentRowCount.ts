import { Request, Response } from "express";
import Joi from "joi";
import { Raw } from "typeorm";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function getAppointmentRowCount(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).read("appointment");

  if (!permission.granted) {
    return res.sendStatus(403);
  }

  const { value, error } = Joi.object({
    fromtoday: Joi.boolean().default(false),
  }).validate(req.query);
  if (error != null) {
    return res.status(400).send(error);
  }

  const { fromtoday } = value;

  let result: number;
  if (fromtoday) {
    result = await AppDataSource.manager.getRepository(Appointment).count({
      where: { startTime: Raw((alias) => `${alias} >= CURRENT_DATE`) },
    });
  } else {
    result = await AppDataSource.manager.getRepository(Appointment).count();
  }

  res.status(200).json(result);
}
