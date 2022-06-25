import { Request, Response } from "express";
import Joi from "joi";
import { Between } from "typeorm";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function getAllAppointmentByDate(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).read("appointment");
  if (!permission.granted) {
    return res.sendStatus(403);
  }
  const schema = Joi.object({
    date: Joi.date().required(),
  });

  const { value, error } = schema.validate(req.body);
  if (error != null) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }

  const date = new Date(value.date);
  // add 24 hours
  const datePlus24 = new Date(date.getTime() + 1000 * 60 * 60 * 24);

  const result = await AppDataSource.manager.getRepository(Appointment).find({
    where: { startTime: Between(date, datePlus24) },
    relations: { patient: true, doctor: true },
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
  });

  // const result = await AppDataSource.manager
  // .createQueryBuilder(Appointment, "app").

  res.status(200).json(result);
}
