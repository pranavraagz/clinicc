import { Request, Response } from "express";
import Joi from "joi";
import { Appointment } from "../../entity/appointment";
import { AppDataSource } from "../../service/data-source";

export async function createAppointment(req: Request, res: Response) {
  const schema = Joi.object({
    start: Joi.date().required(),
    duration_s: Joi.number().required(),
    doctor_id: Joi.number().required(),
    patient_id: Joi.number().required(),
  });

  const { value, error } = schema.validate(req.body);
  if (error != null) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }

  const { start, duration_s, doctor_id, patient_id } = value;

  const appointment = new Appointment();

  const startTime = new Date(start);

  appointment.startTime = startTime;
  appointment.duration = duration_s;
  appointment.doctor = doctor_id;
  appointment.patient = patient_id;

  await AppDataSource.manager.save(appointment);

  res.sendStatus(201);
}
