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
      height: Joi.number(),
      weight: Joi.number(),
      address: Joi.string().allow(""),
      altphone: Joi.string().allow(""),
      email: Joi.string().email().allow(""),
      bp: Joi.string().allow(""),
    });

    const { value, error } = schema.validate(req.body);
    if (error != null) {
      logger.warn(error);
      return res.status(400).json({ error: error.message });
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
      email,
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
    patient.email = email ?? "";

    await AppDataSource.manager.save(patient);

    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
