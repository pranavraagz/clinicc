import { Request, Response } from "express";
import { Staff } from "../../entity/staff";
import { AppDataSource } from "../../service/data-source";

export async function getAllStaff(req: Request, res: Response) {
  const result = await AppDataSource.manager.getRepository(Staff).find();

  res.status(200).json(result);
}
