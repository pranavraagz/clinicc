import { Request, Response } from "express";
import { User } from "../../entity/user";
import { AppDataSource } from "../../service/data-source";

export async function getAllUser(req: Request, res: Response) {
  const result = await AppDataSource.manager.getRepository(User).find();

  res.status(200).json(result);
}
