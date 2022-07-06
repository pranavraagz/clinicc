import { add } from "date-fns";
import { Request, Response } from "express";
import Joi from "joi";
import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual } from "typeorm";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function createAppointment(req: Request, res: Response) {
  try {
    // Permission check
    const permission = ac.can(req.user?.role).create("appointment");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    // Input validation
    const schema = Joi.object({
      start: Joi.date().required(),
      end: Joi.date().optional(),
      doctor_id: Joi.number().required(),
      patient_id: Joi.number().required(),
    });
    const { value, error } = schema.validate(req.body);
    if (error != null) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
    const { start, end, doctor_id, patient_id } = value;
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
    res.status(500).send(error);
  }
}
