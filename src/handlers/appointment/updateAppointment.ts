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
      start: Joi.date().required(),
      end: Joi.date().optional(),
    });
    const { value, error } = schema.validate(req.body);
    if (error != null) {
      logger.warn(error);
      return res.status(401).json({ error: error.message });
    }
    const { start, end, id } = value;
    const inputStartTime = new Date(start);
    let inputEndTime: Date;
    if (end != undefined) {
      inputEndTime = new Date(end);
    } else {
      inputEndTime = add(inputStartTime, {
        minutes: Appointment.APPOINTMENT_DURATION_MINUTES,
      });
    }

    // Find existing appointment
    const appointmentToUpdate = await AppDataSource.manager
      .getRepository(Appointment)
      .findOneBy({ id: id });

    if (appointmentToUpdate == null) {
      return res.status(404).send("Appointment not found");
    }

    // Checking for overlaps upon update:
    const existingOverlap = await AppDataSource.getRepository(
      Appointment
    ).findOne({
      where: [
        {
          startTime: LessThanOrEqual(inputStartTime),
          endTime: MoreThanOrEqual(inputEndTime),
        },
        {
          endTime: MoreThan(inputStartTime),
          startTime: LessThan(inputStartTime),
        },
        { startTime: LessThan(inputEndTime), endTime: MoreThan(inputEndTime) },
        {},
      ],
    });
    if (existingOverlap) {
      return res.status(400).send("Appointment already exists in time period.");
    }

    appointmentToUpdate.startTime =
      inputStartTime ?? appointmentToUpdate.startTime;
    appointmentToUpdate.endTime = inputEndTime;

    await AppDataSource.manager.save(appointmentToUpdate);

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error);
  }
}
