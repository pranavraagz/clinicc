import { Request, Response } from "express";
import Joi from "joi";
import { Patient } from "../../entity/patient";
import { AppDataSource } from "../../service/data-source";

export async function searchPatientByName(req: Request, res: Response) {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
    limit: Joi.number(),
  });

  const { value, error } = schema.validate(req.body);
  if (error != null) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }

  const { name, limit } = value;

  const result = await AppDataSource.manager
    .createQueryBuilder(Patient, "patient")
    .select(["patient.name", "patient.id"])
    .where("name ILIKE :searchTerm", { searchTerm: `%${name}%` })
    .limit(limit ?? 10)
    .getMany();

  res.status(200).send(result);
}
