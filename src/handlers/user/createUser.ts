import { Request, Response } from "express";
import Joi from "joi";
import { User } from "../../entity/user";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function createUser(req: Request, res: Response) {
  try {
    // Permission check
    const permission = ac.can(req.user?.role).create("user");

    if (!permission.granted) {
      return res.sendStatus(403);
    }
    // request validation
    const schema = Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string()
        .valid(...User.validRoles)
        .required(),
    });
    const { value, error } = schema.validate(req.body);
    if (error) {
      res.status(400).send(error.message);
      return;
    }
    const { name, phone, password, role } = value;
    const user = new User();
    user.name = name;
    user.password = password;
    user.phone = phone;
    user.role = role;

    try {
      await AppDataSource.manager.save(user);
    } catch (error) {
      res.status(500).send(error);
      return;
    }
    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
