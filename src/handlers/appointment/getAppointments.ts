import { Request, Response } from "express";
import Joi from "joi";
import { Between } from "typeorm";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function getAppointments(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).read("appointment");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const { value, error } = Joi.object({
      offset: Joi.number().default(0).min(0),
      limit: Joi.number().default(20).max(500),
      from: Joi.date().required(),
      to: Joi.date().required(),
    }).validate(req.query);

    if (error != null) {
      return res.status(400).json({ error: error.message });
    }

    const { offset, limit, from, to } = value;

    const fromTime = new Date(from);
    const toTime = new Date(to);

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
        startTime: Between(fromTime, toTime),
      },
      order: {
        startTime: "ASC",
      },
      take: limit,
      skip: offset,
    });

    res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
