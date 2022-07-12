import { Request, Response } from "express";
import Joi from "joi";
import { User } from "../../entity/user";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function createUser(req: Request, res: Response) {
  try {
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
    if (error != null) {
      res.status(400).json({
        error: error,
      });
      return;
    }
    const { name, phone, password, role } = value;
    // validate username unique-ness
    // try {
    //   var existingUser = await userRepo.findOne({ username: username });
    //   if (existingUser) {
    //     res.status(409).json({
    //       message: "userame already taken",
    //     });
    //     return;
    //   }
    // } catch (e) {
    //   res.status(500).json({ error: error });
    //   return;
    // }
    const user = new User();
    user.name = name;
    user.password = password;
    user.phone = phone;
    user.role = role;

    try {
      await AppDataSource.manager.save(user);
    } catch (error) {
      res.status(500).json({ error: error });
      return;
    }
    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
