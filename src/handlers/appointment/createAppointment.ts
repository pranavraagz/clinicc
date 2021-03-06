import { add, endOfDay } from "date-fns";
import { Request, Response } from "express";
import Joi from "joi";
import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual } from "typeorm";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function createAppointment(req: Request, res: Response) {
  try {
    // Permission check
    const permission = ac.can(req.user?.role).create("appointment");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    // Input validation
    const schema = Joi.object({
      start: Joi.alternatives().conditional("isWalkIn", {
        then: Joi.date().optional(),
        otherwise: Joi.date().required(),
      }),
      isWalkIn: Joi.bool().optional(),
      end: Joi.date().optional(),
      doctor_id: Joi.number().required(),
      patient_id: Joi.number().required(),
      height: Joi.number().optional(),
      weight: Joi.number().optional(),
      bp: Joi.number().allow("").optional(),
    });
    const { value, error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.message);
    const { isWalkIn, start, end, doctor_id, patient_id, height, weight, bp } =
      value;

    // If walkin appointment, just create it at end of day
    if (isWalkIn) {
      const time = endOfDay(Date.now());
      // Creation of new appointment
      const appointment = new Appointment();
      appointment.isWalkIn = true;
      appointment.startTime = time;
      appointment.endTime = time;
      appointment.doctor = doctor_id;
      appointment.patient = patient_id;
      appointment.height = height;
      appointment.weight = weight;
      appointment.bp = bp;

      await AppDataSource.manager.save(appointment);
      return res.sendStatus(201);
    }

    const inputStartTime = new Date(start);
    let inputEndTime: Date;
    if (end != undefined) {
      inputEndTime = new Date(end);
    } else {
      inputEndTime = add(inputStartTime, {
        minutes: Appointment.APPOINTMENT_DURATION_MINUTES,
      });
    }

    // Checking for existing appointment:
    const existing = await AppDataSource.getRepository(Appointment).findOne({
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
    if (existing) {
      return res.status(400).send("Appointment already exists in time period.");
    }

    // Creation of new appointment
    const appointment = new Appointment();
    appointment.startTime = inputStartTime;
    appointment.endTime = inputEndTime;
    appointment.doctor = doctor_id;
    appointment.patient = patient_id;

    // Add to database
    await AppDataSource.manager.save(appointment);

    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
