import { Request, Response } from "express";
import Joi from "joi";
import { Raw } from "typeorm";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function getAppointmentsFromToday(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).read("appointment");
  if (!permission.granted) {
    return res.sendStatus(403);
  }

  const { value, error } = Joi.object({
    offset: Joi.number().default(0).min(0),
    limit: Joi.number().default(20).max(100),
  }).validate(req.query);

  if (error != null) {
    return res.status(400).json({ error: error.message });
  }

  const { offset, limit } = value;

  const result = await AppDataSource.manager.getRepository(Appointment).find({
    relations: {
      patient: true,
      doctor: true,
    },
    select: {
      doctor: {
        id: true,
        name: true,
      },
      patient: {
        name: true,
        phone: true,
        altphone: true,
        id: true,
      },
    },
    where: {
      startTime: Raw((alias) => `${alias} >= CURRENT_DATE`),
    },
    order: {
      startTime: "ASC",
    },
    take: limit,
    skip: offset,
  });

  res.status(200).json(result);
}
