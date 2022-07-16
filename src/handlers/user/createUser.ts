import { Request, Response } from "express";
import Joi from "joi";
import { createDoctor } from "../../controllers/doctor/createDoctor";
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
    let user = new User();
    user.name = name;
    user.password = password;
    user.phone = phone;
    user.role = role;

    try {
      user = await AppDataSource.manager.save(user);
    } catch (error) {
      res.status(500).send(error);
      return;
    }

    // If user is a doctor, then create the corresponding doctor as well
    if (user.role === "doctor") {
      try {
        await createDoctor(user.id);
      } catch (error) {
        // If Doctor creation fails, then delete the user and return the error
        await AppDataSource.getRepository(User).delete({ id: user.id });
        return res.status(400).send(error);
      }
    }

    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
