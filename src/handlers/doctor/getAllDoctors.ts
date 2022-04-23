import { Request, Response } from "express";
import { Doctor } from "../../entity/doctor";
import { AppDataSource } from "../../service/data-source";

export async function getAllDoctors(req: Request, res: Response) {
  const result = await AppDataSource.manager.getRepository(Doctor).find();

  res.status(200).json(result);
}
