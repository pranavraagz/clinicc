import { Request, Response } from "express";
import Joi from "joi";
import { Patient } from "../../entity/patient";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function updatePatient(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).update("patient");
    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string(),
      date_of_birth: Joi.date(),
      phone: Joi.string(),
      sex: Joi.string(),
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
      id,
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

    const patient = await AppDataSource.manager
      .getRepository(Patient)
      .findOneBy({ id: parseInt(id) });

    if (!patient) {
      return res.status(400).send("Not found");
    }

    patient.name = name ?? patient.name;
    patient.dob = date_of_birth ?? patient.dob;
    patient.phone = phone ?? patient.phone;
    patient.sex = sex ?? patient.sex;
    patient.height = height ?? patient.height;
    patient.weight = weight ?? patient.weight;
    patient.address = address ?? patient.address;
    patient.altphone = altphone ?? patient.altphone;
    patient.bp = bp ?? patient.bp;
    patient.email = email ?? patient.email;

    await AppDataSource.manager.save(patient);

    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
