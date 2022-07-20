import { Request, Response } from "express";
import Joi from "joi";
import { Between, FindManyOptions } from "typeorm";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function getAppointmentRowCount(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).read("appointment");

    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const { value, error } = Joi.object({
      from: Joi.date().required(),
      to: Joi.date().required(),
      is_paid_only: Joi.bool().optional(),
    }).validate(req.query);
    if (error) return res.status(400).send(error);

    const { from, to, is_paid_only } = value;
    const fromTime = new Date(from);
    const toTime = new Date(to);

    let where: any = {
      startTime: Between(fromTime, toTime),
    };
    if (is_paid_only) {
      where = { ...where, isPaid: true };
    }

    let result: number;
    result = await AppDataSource.manager.getRepository(Appointment).count({
      where: where,
    });

    res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
