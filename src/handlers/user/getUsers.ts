import { Request, Response } from "express";
import Joi from "joi";
import { User } from "../../entity/user";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function getUsers(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).read("user");

    if (!permission.granted) {
      return res.sendStatus(403);
    }

    const { value, error } = Joi.object({
      offset: Joi.number().default(0).min(0),
      limit: Joi.number().default(20).max(100),
      name: Joi.string().optional(),
      phone: Joi.string().optional(),
    }).validate(req.query);

    if (error) return res.status(400).send(error.message);

    const { offset, limit, name, phone } = value;

    const query = AppDataSource.manager
      .getRepository(User)
      .createQueryBuilder("user")
      .orderBy("user.id", "ASC");

    if (name) {
      query.andWhere("name LIKE :searchTerm", { searchTerm: `%${name}%` });
    }
    if (phone) {
      query.andWhere("user.phone = :phone", { phone: phone });
    }

    query
      .offset(offset)
      .limit(limit)
      .select(["user.id", "user.name", "user.phone", "user.role"]);

    const result = await query.getMany();

    res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
