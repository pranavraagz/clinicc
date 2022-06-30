import { Request, Response } from "express";
import { Patient } from "../../entity/patient";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function getPatientRowCount(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).read("patient");

  if (!permission.granted) {
    return res.sendStatus(403);
  }

  const result = await AppDataSource.manager.getRepository(Patient).count();

  console.log(result);

  res.status(200).json(result);
}
