import { Request, Response } from "express";
import Joi from "joi";
import { Patient } from "../../entity/patient";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function getAllPatients(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).read("patient");

  if (!permission.granted) {
    return res.sendStatus(403);
  }

  const { value, error } = Joi.object({
    offset: Joi.number().default(0).min(0),
    limit: Joi.number().default(20).max(100),
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
  }).validate(req.query);

  if (error != null) {
    res.status(401).json({ error: error.message });
    return;
  }

  const { offset, limit, name, phone } = value;

  const query = AppDataSource.manager
    .getRepository(Patient)
    .createQueryBuilder("patient")
    .orderBy("patient.id", "DESC");

  if (name) {
    query.andWhere("name ILIKE :searchTerm", { searchTerm: `%${name}%` });
  }
  if (phone) {
    query.andWhere("patient.phone = :phone", { phone: phone });
  }

  query.offset(offset).limit(limit);

  const result = await query.getMany();

  res.status(200).json(result);
}
