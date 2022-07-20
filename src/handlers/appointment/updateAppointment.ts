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
      isPaid: Joi.bool().optional().valid(true), // Only allow it to be set to true.
      isAttended: Joi.bool().optional(),
    });
    const { value, error } = schema.validate(req.body);
    if (error) return res.status(400).send(error);

    const { id, height, weight, bp, isPaid, isAttended } = value;

    // Find existing appointment
    const appointmentToUpdate = await AppDataSource.manager
      .getRepository(Appointment)
      .findOneBy({ id: id });

    if (appointmentToUpdate == null)
      return res.status(404).send("Appointment not found");

    if (height) appointmentToUpdate.height = height;
    if (weight) appointmentToUpdate.weight = weight;
    if (bp) appointmentToUpdate.bp = bp;
    if (isPaid !== null) appointmentToUpdate.isPaid = true; // Can only be set to true, cannot be set to false
    if (isAttended !== null) appointmentToUpdate.isAttended = isAttended;

    await AppDataSource.manager.save(appointmentToUpdate);

    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    return res.status(500).send(error);
  }
}
