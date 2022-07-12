import { Request, Response } from "express";
import { User } from "../../entity/user";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function getAllUser(req: Request, res: Response) {
  try {
    const result = await AppDataSource.manager.getRepository(User).find();

    res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
