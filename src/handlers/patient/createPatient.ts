import { Request, response, Response } from "express";
import Joi from "joi";
import { Patient } from "../../entity/patient";
import { AppDataSource } from "../../service/data-source";

export async function createPatient(req: Request, res: Response) {
  const schema = Joi.object({
    name: Joi.string().required(),
    date_of_birth: Joi.date().required(),
    phone: Joi.string().required(),
    sex: Joi.string().required(),
    height: Joi.number(),
    weight: Joi.number(),
    address: Joi.string(),
    altphone: Joi.string(),
    bp: Joi.string(),
  });

  const { value, error } = schema.validate(req.body);
  if (error != null) {
    console.log(error);
    response.status(401).json({ error: error.message });
  }

  const {
    name,
    date_of_birth,
    phone,
    sex,
    height,
    weight,
    address,
    altphone,
    bp,
  } = value;

  const patient = new Patient();

  patient.name = name;
  patient.dob = date_of_birth;
  patient.phone = phone;
  patient.sex = sex;
  patient.height = height ?? 0;
  patient.weight = weight ?? 0;
  patient.address = address ?? "";
  patient.altphone = altphone ?? "";
  patient.bp = bp ?? "";

  await AppDataSource.manager.save(patient);

  res.sendStatus(201);
}
