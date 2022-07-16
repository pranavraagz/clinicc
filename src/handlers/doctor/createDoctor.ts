import { Request, Response } from "express";
import Joi from "joi";
import { Doctor } from "../../entity/doctor";
import { User } from "../../entity/user";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function createDoctor(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).create("doctor");
    if (!permission.granted) {
      return res.sendStatus(403);
    }
    const schema = Joi.object({
      user_id: Joi.number().required(),
      name: Joi.string().optional(),
      phone: Joi.string().optional(),
    });

    const { value, error } = schema.validate(req.body);
    if (error) {
      logger.warn(error);
      return res.status(400).send(error.message);
    }

    const { user_id, name, phone } = value;

    const user = await AppDataSource.getRepository(User).findOneBy({
      id: user_id,
    });

    if (user == null) {
      return res.status(400).send("User not found");
    }
    if (user.role !== "doctor") {
      return res
        .status(400)
        .send(
          "User does have have doctor role and therefore cannot be used to create a doctor"
        );
    }

    const doctor = new Doctor();

    doctor.name = name ?? user.name;
    doctor.phone = phone ?? user.phone;
    doctor.user = user;

    await AppDataSource.getRepository(Doctor).save(doctor);
    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
