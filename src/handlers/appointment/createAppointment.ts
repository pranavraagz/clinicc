import { add } from "date-fns";
import { Request, Response } from "express";
import Joi from "joi";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function createAppointment(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).create("appointment");
    if (!permission.granted) {
      return res.sendStatus(403);
    }
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

    const appointment = new Appointment();

    const startTime = new Date(start);
    let endTime: Date;
    if (end != undefined) {
      endTime = new Date(end);
    } else {
      endTime = add(startTime, {
        minutes: Appointment.APPOINTMENT_DURATION_MINUTES,
      });
    }

    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.doctor = doctor_id;
    appointment.patient = patient_id;

    await AppDataSource.manager.save(appointment);

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
}
