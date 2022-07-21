import { Request, Response } from "express";
import Joi from "joi";
import { Patient } from "../../entity/patient";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function createPatient(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).create("patient");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const schema = Joi.object({
      name: Joi.string().required(),
      date_of_birth: Joi.date().required(),
      phone: Joi.string().required(),
      sex: Joi.string().required(),
      address: Joi.string().allow(""),
      altphone: Joi.string().allow(""),
      email: Joi.string().email().allow(""),
    });

    const { value, error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const { name, date_of_birth, phone, sex, address, altphone, email } = value;

    const patient = new Patient();

    patient.name = name;
    patient.dob = date_of_birth;
    patient.phone = phone;
    patient.sex = sex;
    patient.address = address ?? "";
    patient.altphone = altphone ?? "";
    patient.email = email ?? "";

    await AppDataSource.manager.save(patient);

    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
