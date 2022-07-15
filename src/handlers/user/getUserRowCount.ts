import { Request, Response } from "express";
import { User } from "../../entity/user";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function getUserRowCount(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).read("user");

    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const result = await AppDataSource.manager.getRepository(User).count();

    res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
