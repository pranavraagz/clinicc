import { Request, Response } from "express";
import { Patient } from "../../entity/patient";
import { AppDataSource } from "../../service/data-source";

export async function getAllPatients(req: Request, res: Response) {
  const result = await AppDataSource.manager.getRepository(Patient).find();

  res.status(200).json(result);
}
