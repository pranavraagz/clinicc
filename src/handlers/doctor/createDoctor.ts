import { Request, Response } from "express";
import Joi from "joi";
import { JoinColumn } from "typeorm";
import { Doctor } from "../../entity/doctor";
import { Patient } from "../../entity/patient";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function createDoctor(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).create("doctor");
  if (!permission.granted) {
    return res.sendStatus(403);
  }
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    altphone: Joi.string(),
    address: Joi.string(),
  });

  const { value, error } = schema.validate(req.body);
  if (error != null) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }

  const { name, phone, altphone, address } = value;

  const doctor = new Doctor();

  doctor.name = name;
  doctor.phone = phone;
  doctor.address = address ?? "";
  doctor.altphone = altphone ?? "";

  await AppDataSource.manager.save(doctor);

  res.sendStatus(201);
}
