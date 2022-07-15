import { add } from "date-fns";
import { Request, Response } from "express";
import Joi from "joi";
import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual } from "typeorm";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function updateAppointment(req: Request, res: Response) {
  try {
    // Permission check
    const permission = ac.can(req.user?.role).update("appointment");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    // Input validation
    const schema = Joi.object({
      id: Joi.number().required(),
      height: Joi.number().optional(),
      weight: Joi.number().optional(),
      bp: Joi.string().allow("").optional(),
    });
    const { value, error } = schema.validate(req.body);
    if (error != null) {
      logger.warn(error);
      return res.status(400).json({ error: error.message });
    }
    const { id, height, weight, bp } = value;

    // Find existing appointment
    const appointmentToUpdate = await AppDataSource.manager
      .getRepository(Appointment)
      .findOneBy({ id: id });

    if (appointmentToUpdate == null) {
      return res.status(404).send("Appointment not found");
    }

    appointmentToUpdate.height = height;
    appointmentToUpdate.weight = weight;
    appointmentToUpdate.bp = bp;

    await AppDataSource.manager.save(appointmentToUpdate);

    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
}
