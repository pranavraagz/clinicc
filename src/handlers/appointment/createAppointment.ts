import { Request, response, Response } from "express";
import Joi from "joi";
import { Appointment } from "../../entity/appointment";
import { AppDataSource } from "../../service/data-source";

export async function createAppointment(req: Request, res: Response) {
  const schema = Joi.object({
    start: Joi.date().required(),
    end: Joi.date().required(),
    doctor_id: Joi.number().required(),
    patient_id: Joi.number().required(),
  });

  const { value, error } = schema.validate(req.body);
  if (error != null) {
    console.log(error);
    response.status(401).json({ error: error.message });
  }

  const { start, end, doctor_id, patient_id } = value;

  const appointment = new Appointment();

  const startTime = new Date(start);
  const endTime = new Date(end);

  if (endTime.getTime() - startTime.getTime() < 0) {
    res.status(400).json({ msg: "End time cannot be before start time" });
    return;
  }

  appointment.startTime = startTime;
  appointment.endTime = endTime;
  appointment.doctor = doctor_id;
  appointment.patient = patient_id;

  await AppDataSource.manager.save(appointment);

  res.sendStatus(201);
}
