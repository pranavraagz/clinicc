import { Request, Response } from "express";
import Joi from "joi";
import { Doctor } from "../../entity/doctor";
import { User } from "../../entity/user";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function getDoctor(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).read("doctor");
    if (!permission.granted) {
      return res.sendStatus(403);
    }
    const { value, error } = Joi.object({
      id: Joi.number().when("user_id", {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
      }),
      user_id: Joi.number().optional(),
    }).validate(req.query);

    if (error) return res.status(400).send(error.message);
    const { id, user_id } = value;

    let doctor;
    if (id) {
      doctor = await AppDataSource.manager
        .getRepository(Doctor)
        .findOneBy({ id: parseInt(id) });
    } else if (user_id) {
      doctor = await AppDataSource.getRepository(Doctor).findOne({
        where: { user: { id: user_id } },
      });
    }

    if (doctor) {
      res.status(200).send(doctor);
    } else {
      res.status(400).send("Doctor not found");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
