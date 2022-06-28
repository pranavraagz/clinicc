import { Request, Response } from "express";
import { Patient } from "../../entity/patient";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function getAllPatients(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).read("patient");
  if (!permission.granted) {
    return res.sendStatus(403);
  }

  const query = AppDataSource.manager
    .getRepository(Patient)
    .createQueryBuilder("patient")
    .orderBy("patient.id");

  const result = await query.getMany();

  res.status(200).json(result);
}
