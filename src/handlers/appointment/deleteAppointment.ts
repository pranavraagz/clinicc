import { Request, Response } from "express";
import Joi from "joi";
import { Appointment } from "../../entity/appointment";
import { ac } from "../../service/access-control";
import { AppDataSource } from "../../service/data-source";
import { logger } from "../../service/logger";

export async function deleteAppointment(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user?.role).delete("appointment");
    if (!permission.granted) {
      return res.sendStatus(403);
    }
    const schema = Joi.object({
      id: Joi.number().required(),
    });

    const { value, error } = schema.validate(req.params);
    if (error != null) {
      console.error(error);
      return res.status(401).send(error);
    }

    const { id } = value;

    const repo = AppDataSource.manager.getRepository(Appointment);
    const appointment = await repo.findOneBy({ id: parseInt(id) });

    if (appointment == null) {
      res.status(404).json({ msg: "Appointment does not exist" });
      return;
    }

    await repo.delete({ id: parseInt(id) });

    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
}
