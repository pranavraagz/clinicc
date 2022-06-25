import { Request, Response } from "express";
import { Doctor } from "../../entity/doctor";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";

export async function getAllDoctors(req: Request, res: Response) {
  const permission = ac.can(req.user?.role).read("doctor");
  if (!permission.granted) {
    return res.sendStatus(403);
  }
  const result = await AppDataSource.manager.getRepository(Doctor).find();

  res.status(200).json(result);
}
